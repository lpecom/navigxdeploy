import React from 'react';
import { RentalForm } from "@/components/RentalForm";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-navig">Alugue seu carro por assinatura</h1>
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <RentalForm />
        </div>
        <p className="text-center mt-8 text-sm text-gray-600">
          *Todos os valores, modelos e cores de carros divulgados nesta publicação estão sujeitos a mudanças dependendo do tempo e onde visualizar esta campanha. Consultar nossos atendentes via (11) 98673-4110.
        </p>
      </div>
    </div>
  );
};

export default Home;