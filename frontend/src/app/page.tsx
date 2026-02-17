export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">
          🧹 Limpeza Pro
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma de Agendamento de Limpeza Profissional
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-bold text-indigo-600 mb-2">Rápido</h3>
              <p className="text-sm text-gray-600">Agende em segundos</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-purple-600 mb-2">Confiável</h3>
              <p className="text-sm text-gray-600">100% dos agendamentos</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <h3 className="font-bold text-pink-600 mb-2">Seguro</h3>
              <p className="text-sm text-gray-600">Pagamentos protegidos</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
              Agendar Agora
            </button>
            <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-indigo-50 transition">
              Saiba Mais
            </button>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Status:</strong> Aplicação em desenvolvimento - Estoque completo, novo projeto em desenvolvimento! 🚀
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
