import { useEffect, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { Card } from "@mantine/core";


const variants = {
    enter: { rotateX: -90, opacity: 0 },
    center: { rotateX: 0, opacity: 1 },
    exit: { rotateX: 90, opacity: 0 }
}

function Newsfeed({ newOrders, newShipments, newPickups, newDeliveries, newBids, onRefresh, newsLoading }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const items = [
        { count: newOrders, label: 'New Orders' },
        { count: newShipments, label: 'New Shipments' },
        { count: newPickups, label: 'New Pickups' },
        { count: newDeliveries, label: 'New Deliveries' },
        { count: newBids, label: 'New Spot Bids' }
    ]

    useEffect(() => {


        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % items.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [items.length])

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 160 }}>
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    variants={variants}
                    initial='enter'
                    animate='center'
                    exit='exit'
                    transition={{ duration: 0.5 }}
                    style={{ height: '100%', width: '100%', display: 'flex' }}
                >
                    <Card className='newsfeed-card'>
                        <div style={{ display: 'flex', flexDirection: 'column' , paddingLeft: '6rem' }}>
                            <h1 style={{ margin: '0', color: '#f6bd02', borderBottom: '0.5px solid #333' }}>
                                {items[currentIndex]?.count}
                            </h1>
                            <h3 style={{ margin: '0', color: '#adadad' }}>
                                {items[currentIndex]?.label}
                            </h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', height: 130, gap: '1rem', justifyContent: 'space-between' }}>
                            {items.map((item, idx) => <div onClick={() => setCurrentIndex(idx)} className={idx === currentIndex ? 'current-news news-indicator ' : 'news-indicator'} key={idx} style={{ width: '10px', height: '10px', border: '1px solid #f6bd02', borderRadius: '15px' }}></div>)}
                        </div>
                    </Card>


                </motion.div>
            </AnimatePresence>

        </div>

    )
};

export default Newsfeed;