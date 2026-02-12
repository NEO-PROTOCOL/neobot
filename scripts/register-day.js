import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = '29fb6f21-b534-41c0-8a2a-88dbefedc498';

async function registerDay() {
    try {
        const today = new Date().toLocaleDateString('pt-BR');
        const updateSummary = `✅ [Fênix Mode] Ativado WhatsApp Soberano no Neo Agent Full. Sistema de Vendas v2.0 migrado. Pronto para Railway. Data: ${today}`;

        // Search for the project
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: 'Name',
                title: {
                    contains: 'FlowCloser Agent'
                }
            }
        });

        if (response.results.length > 0) {
            const pageId = response.results[0].id;
            await notion.pages.update({
                page_id: pageId,
                properties: {
                    'Status': {
                        status: { name: 'Ativo' }
                    },
                    'Description': {
                        rich_text: [{ text: { content: updateSummary } }]
                    }
                }
            });
            console.log('✅ Notion atualizado com sucesso!');
        } else {
            console.log('❌ Projeto não encontrado para atualização.');
        }
    } catch (error) {
        console.error('❌ Erro ao atualizar Notion:', error.message);
    }
}

registerDay();
