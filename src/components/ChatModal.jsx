import { Modal , Input , Button , Image} from '@mantine/core';
import {useState , useEffect , useRef} from 'react'
import sendIcon from '../assets/paper-plane-right.svg'

function ChatModal({ visibleModal, setVisibleModal, shipment, user , auth, conversation , getConversation  }) {
    const API_URL = import.meta.env.VITE_API_URL

    const [messageText , setMessageText] = useState('');

    const msgsEndRef = useRef(null)

     useEffect(() => {
        if (visibleModal && conversation?.messages) {
            setTimeout(() => {
                if (msgsEndRef.current) {
                    msgsEndRef.current.scrollTop = msgsEndRef.current.scrollHeight;
                }
            }, 500);
        }
    }, [visibleModal, conversation])

    function handleSendMessage(e){
        e.preventDefault();
        (conversation && conversation.messages && conversation.messages.length > 0) ?
        sendNewMessage()
        : createNewConversation()
    }

    async function sendNewMessage(){
        try{
            let response = await fetch(`${API_URL}/api/shared/conversations/messages?conversationId=${conversation.conv_id}` , {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' , 
                    'Authorization' : `Bearer ${auth}`
                },
                body: JSON.stringify({text: messageText})
            });

            let result = await response.json();

            if(result.message){
                setMessageText('')
                getConversation(shipment.id)
            }
        }catch(error){
            console.log(error)
        }
    }

    async function createNewConversation(){
        try{
            let response = await fetch(`${API_URL}/api/shared/conversations?shipmentNumber=${shipment.shipment_number}` , {
                method: 'POST' , 
                headers: {
                    'Content-Type' : 'application/json' , 
                    'Authorization' : `Bearer ${auth}`
                },
                body: JSON.stringify({text: messageText})
            })

            let result = await response.json();

            if(result.conversation){
                setMessageText('')
                getConversation(shipment.id)
            }
        }catch(error){
            console.log(error)
        }
    }

    return (
        <Modal styles={{
            content: { backgroundColor: '#272727' },
            header: { backgroundColor: '#272727' },
            title: { width: '100%', display: 'flex', justifyContent: 'center' }
        }}
            title={
                
                    conversation && (conversation.carrier_name || conversation.company_name)?
                        <div style = {{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                     <Image
                        src={user.client === 'shipper' ? `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation?.carrier_name)}&background=333&color=FFFFFF` : `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation?.company_name)}&background=333&color=FFFFFF`}

                        alt="Profile"
                        h={40}
                        w={40}
                        radius="xl"
                    />

                    <span style={{ display: 'block', color: 'white', fontSize: '0.8rem' }}>{conversation?.shipment_number}</span>

                        
                </ div>
            : <h2 style={{color: 'white'}}>New Conversation</h2>}

            opened={visibleModal} onClose={() => setVisibleModal(false)}>

            <div id='convo-container' style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
                {conversation ? <div ref={msgsEndRef} style={{ flex: 1, overflowY: 'auto' }}>
                    {(conversation?.messages || []).map(msg => (
                        <div key={msg.id} className={msg.sender === user.client ? 'sent' : 'received'}>
                            <div className={msg.sender === user.client ? 'msg-right' : 'msg-left'}>
                                {msg.text}
                            </div>
                            <span style={{ display: 'inline-block', fontSize: '0.6rem', color: '#FFFFFF' }}>{new Date(msg.time_sent).toLocaleString()}</span>
                        </div>
                    ))}

                </div> : <div></div>}

                <form id='convo-footer-div' onSubmit={(e) => handleSendMessage(e)}>
                    <Input styles={{ wrapper: { width: '100%' }, input: { width: '100%' } }} id='message-text-input' value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder='Message' />
                    <Button id='send-btn' type='submit'><Image src={sendIcon} /></Button>
                </form>

            </div>
        </Modal>
    )
}

export default ChatModal;