import React from 'react';
import PaymentCard from '../../components/AshHouseCard/PaymentCard';
import Navbar from 'src/Layouts/Navbar';
import Footer from 'src/Layouts/Footer';

const AshHousePage: React.FC = () => {

    return (
        <>
            <Navbar />
            <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 flex items-center justify-center p-5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-[shimmer_3s_ease-in-out_infinite]" />
                <PaymentCard />
                <div />
            </div>
            <Footer />
        </>
    );
};
export default AshHousePage;