import { useState, useEffect } from 'react'
import { Badge, Loader, Image } from '@mantine/core'
import refreshIcon from '../assets/arrow-counter-clockwise.svg'
import '../styles/spotMarket.css'

function CountdownBadge({ deadline, shipmentsList, user , id , resetBidDeadline }) {

    const [timeLeft, setTimeLeft] = useState('')
    const [badgeColor, setBadgeColor] = useState('green')


    useEffect(() => {
        if (!deadline) return


        const interval = setInterval(() => {
            const now = Date.now() // returns UTC milliseconds directly
            const gap = new Date(deadline ).getTime() - now

            if (gap <= 0) {
                setTimeLeft('Expired')
                clearInterval(interval)
                setBadgeColor('red')
                return
            }

            const hours = Math.floor(gap / (1000 * 60 * 60)) //how many full hours are in the gap
            const minutes = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60)) //how many full minutes are in the remainder of the gap divided into hours
            const seconds = Math.floor((gap % (1000 * 60)) / 1000) //how many full seconds are in the remainder of the gap divided into minutes

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
            setBadgeColor(hours >= 1 ? 'green' : (minutes > 30 ? 'yellow' : 'red'))
        }, 1000);

        return () => clearInterval(interval)
    }, [deadline])


    return (
        <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center' }}>
            {timeLeft === '' &&
                <Loader size={20} color='white' />}
            {timeLeft !== '' &&
                <Badge color={badgeColor} rightSection={timeLeft === 'Expired' && user.client === 'shipper' &&
                    <Image id='refresh-btn' src={refreshIcon} h={15} w={'auto'} className='offer-action-btn' onClick={()=>resetBidDeadline(id)} />}>
                    {timeLeft}

                </Badge>}

        </div>
    )
}

export default CountdownBadge;