import crypto from "node:crypto";

/**
 * Merkle Tree implementation for Proof-of-Execution (PoE) in Neobot.
 * Aligned with FlowPay's PoE architecture.
 */
export class MerkleTree {
    private leaves: string[];
    private layers: string[][];

    /**
     * @param leaves - Array of hex strings (hashes)
     */
    constructor(leaves: string[]) {
        if (!leaves || leaves.length === 0) {
            throw new Error("MerkleTree requires at least one leaf");
        }
        this.leaves = leaves.map((leaf) => this._ensureHex(leaf)).sort();
        this.layers = [this.leaves];
        this._buildTree();
    }

    private _ensureHex(value: string): string {
        if (typeof value !== "string") value = String(value);
        return value.startsWith("0x") ? value.slice(2) : value;
    }

    private _hash(data: string): string {
        return crypto.createHash("sha256").update(Buffer.from(data, "hex")).digest("hex");
    }

    private _hashPair(left: string, right?: string): string {
        if (!right) return left;
        const combined = left < right ? left + right : right + left;
        return this._hash(combined);
    }

    private _buildTree(): void {
        let currentLayer = this.leaves;
        while (currentLayer.length > 1) {
            const nextLayer: string[] = [];
            for (let i = 0; i < currentLayer.length; i += 2) {
                nextLayer.push(this._hashPair(currentLayer[i], currentLayer[i + 1]));
            }
            this.layers.push(nextLayer);
            currentLayer = nextLayer;
        }
    }

    public getRoot(): string {
        return `0x${this.layers[this.layers.length - 1][0]}`;
    }

    /**
     * Generates a proof for a specific leaf
     * @param leaf - The leaf hash to prove
     * @returns Proof steps
     */
    public getProof(leaf: string): Array<{ position: "left" | "right"; data: string }> | null {
        let index = this.leaves.indexOf(this._ensureHex(leaf));
        if (index === -1) return null;

        const proof: Array<{ position: "left" | "right"; data: string }> = [];
        for (let i = 0; i < this.layers.length - 1; i++) {
            const layer = this.layers[i];
            const isRightNode = index % 2;
            const pairIndex = isRightNode ? index - 1 : index + 1;

            if (pairIndex < layer.length) {
                proof.push({
                    position: isRightNode ? "left" : "right",
                    data: `0x${layer[pairIndex]}`,
                });
            }
            index = Math.floor(index / 2);
        }
        return proof;
    }

    /**
     * Verifies a proof against a root
     */
    public static verify(leaf: string, proof: Array<{ position: "left" | "right"; data: string }>, root: string): boolean {
        let hash = leaf.startsWith("0x") ? leaf.slice(2) : leaf;
        for (const step of proof) {
            const data = step.data.startsWith("0x") ? step.data.slice(2) : step.data;
            if (step.position === "left") {
                hash = crypto.createHash("sha256").update(Buffer.from(data + hash, "hex")).digest("hex");
            } else {
                hash = crypto.createHash("sha256").update(Buffer.from(hash + data, "hex")).digest("hex");
            }
        }
        return `0x${hash}` === root;
    }
}
