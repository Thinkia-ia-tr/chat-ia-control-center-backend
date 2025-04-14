
import { useParams } from "react-router-dom";
import { ConversationDetail as ConversationDetailContent } from "@/components/conversations/ConversationDetail";
import Layout from "@/components/layout/Layout";

export default function ConversationDetailPage() {
  const { id } = useParams();
  
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Conversación</h1>
        <ConversationDetailContent 
          title="Tema de la conversación"
          date="lun., 2 de sep. de 2024 10:15"
          messages={[
            {
              id: "1",
              sender: "user",
              content: `{
  "@vite/client": "^4.0.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.2",
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.1",
    "@eslint-plugin-react-hooks": "^4.6.2",
    "@eslint-plugin-react-refresh": "^3.5.0",
    "vite": "^5.3.4"
  }
}`,
              timestamp: "lun., 2 de sep. de 2024 10:16",
              senderName: "Anonymous"
            },
            {
              id: "2",
              sender: "agent",
              content: "¡Todo parece estar correctamente configurado en tu archivo package.json! ¿Hay algo más en lo que pueda ayudarte con tu proyecto de red social frontend?",
              timestamp: "lun., 2 de sep. de 2024 10:15"
            },
            {
              id: "3",
              sender: "user",
              content: `me sale este error $ npm run dev
npm error Missing script: "dev"
npm error 
npm error To see a list of scripts, run:
npm error   npm run
npm error   npm run To see a list of scripts, run:
npm error   npm error  A complete log of this run can be found in: C:\\Users\\tatio\\AppData\\Local\\npm-cache_logs\\2024-09-02T08_07.06-debug-0.log`,
              timestamp: "lun., 2 de sep. de 2024 10:17",
              senderName: "Anonymous"
            },
            {
              id: "4",
              sender: "agent",
              content: "Parece que el script \"dev\" no se está reconociendo. ¿Podrías verificar que estás en el directorio correcto donde se encuentra tu archivo package.json y que no haya errores de escritura en el nombre del script en el archivo package.json?",
              timestamp: "lun., 2 de sep. de 2024 10:17"
            }
          ]}
        />
      </div>
    </Layout>
  );
}
