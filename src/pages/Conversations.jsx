import { useState, useEffect, useRef, useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationsContext';
import { useNavigate } from 'react-router';
import { Image, Modal, Input, Button, Badge } from '@mantine/core';
import sendIcon from '../assets/paper-plane-right.svg';
import '../styles/conversations.css'
import refreshToken from '../utils/refresh';

function Conversations({ auth, user, setAuth }) {
    const API_URL = import.meta.env.VITE_API_URL

    const navigate = useNavigate()

    const [conversations, setConversations] = useState([])
    const [messageText, setMessageText] = useState('')
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [visibleModal, setVisibleModal] = useState(false)

    const msgsEndRef = useRef(null)

    const notificationsContext = useContext(NotificationContext)
    const fetchUnread = notificationsContext.fetchMessages
    const convoNotifications = notificationsContext.convoNotifications

    function isUnread(convoId) {
        let isUnread = convoNotifications.find(convo => convoId === convo.conv_id);

        return isUnread;
    }

    useEffect(() => {
        if (visibleModal && selectedConversation?.messages) {
            setTimeout(() => {
                if (msgsEndRef.current) {
                    msgsEndRef.current.scrollTop = msgsEndRef.current.scrollHeight;
                }
            }, 500);
        }
    }, [visibleModal, selectedConversation])

    useEffect(() => {
        fetchConversations();
    }, [])

    useEffect(() => {
        console.log(conversations);
    }, [conversations])

    async function fetchConversations() {
        try {
            let response = await fetch(`${API_URL}/api/shared/conversations?status=true,false&sender=carrier,shipper`, {
                headers: {
                    'Content-Type': 'appliction/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shared/conversations?status=true,false&sender=carrier,shipper`, {
                        headers: {
                            'Content-Type': 'appliction/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            let result = await response.json();

            setConversations(result.conversations)
            return result.conversations
        } catch (error) {
            console.log(error)
        }
    }

    async function sendMessage() {
        try {
            let response = await fetch(`${API_URL}/api/shared/conversations/messages?conversationId=${selectedConversation.conv_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({
                    text: messageText
                })
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shared/conversations/messages?conversationId=${selectedConversation.conv_id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({
                            text: messageText
                        })
                    });
                }
            }

            let result = await response.json()
        } catch (error) {
            console.log(error)
        }
    }

    async function readMessages(convo) {
        try {
            let response = await fetch(`${API_URL}/api/shared/conversations/messages/${convo.conv_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shared/conversations/messages/${convo.conv_id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            let result = await response.json()

            await fetchUnread()

            return result;
        } catch (error) {
            console.log(error)
        }
    }

    async function handleConvoClick(convo) {
        await readMessages(convo)
        setSelectedConversation(convo);
        setVisibleModal(true)
    }

    async function handleSendMessage(e) {
        e.preventDefault();
        await sendMessage();
        const updatedConvos = await fetchConversations();
        const matchConvo = updatedConvos.find(c => c.conv_id === selectedConversation.conv_id)
        setSelectedConversation(matchConvo)

        setMessageText('');
    }

    return (
        <div style={{ color: 'white' }}>
            <h1 id='header'>Conversations</h1>
            <Modal styles={{
                content: { backgroundColor: '#272727' },
                header: { backgroundColor: '#272727' },
                title: { width: '100%', display: 'flex', justifyContent: 'center' }
            }}
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <Image
                            src={user.client === 'shipper' ? `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation?.carrier_name)}&background=333&color=FFFFFF` : `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation?.company_name)}&background=333&color=FFFFFF`}

                            alt="Profile"
                            h={40}
                            w={40}
                            radius="xl"
                        />

                        <span style={{ display: 'block', color: 'white', fontSize: '0.8rem' }}>{selectedConversation?.shipment_number}</span>
                    </div>}

                opened={visibleModal} onClose={() => setVisibleModal(false)}>

                <div id='convo-container' style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
                    <div ref={msgsEndRef} style={{ flex: 1, overflowY: 'auto' }}>
                        {selectedConversation?.messages.map(msg => (
                            <div key={msg.id} className={msg.sender === user.client ? 'sent' : 'received'}>
                                <div className={msg.sender === user.client ? 'msg-right' : 'msg-left'}>
                                    {msg.text}
                                </div>
                                <span style={{ display: 'inline-block', fontSize: '0.6rem', color: '#FFFFFF' }}>{new Date(msg.time_sent).toLocaleString()}</span>
                            </div>
                        ))}

                    </div>

                    <form id='convo-footer-div' onSubmit={(e) => handleSendMessage(e)}>
                        <Input styles={{ wrapper: { width: '100%' }, input: { width: '100%' } }} id='message-text-input' value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder='Message' />
                        <Button id='send-btn' type='submit'><Image src={sendIcon} /></Button>
                    </form>

                </div>
            </Modal>
            {conversations?.length <= 0 ? 'No conversations yet.' :
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
                    {conversations.map(convo => (
                        <div className='conversation-div' onClick={() => handleConvoClick(convo)} key={convo.conv_id} style={{ display: 'flex', width: '100%', gap: '2rem', borderBottom: 'solid gray 0.8px', paddingLeft: '1rem', alignItems: 'center', paddingRight: '1rem', paddingTop: '1rem', paddingBottom: '1rem' }}>
                            {isUnread(convo.conv_id) && <div className='badge-div'><Badge size='xs' circle /></div>}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Image src={user.client === 'shipper' ? `https://ui-avatars.com/api/?name=${encodeURIComponent(convo.carrier_name)}&background=f6bd02&color=0B1F3A` : `https://ui-avatars.com/api/?name=${encodeURIComponent(convo.company_name)}&background=f6bd02&color=0B1F3A`} alt="Profile" h={60} w={60} radius="xl" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '.8rem' }}>
                                    <span style={{ display: 'inline-block' }}>{user.client === 'shipper' ? convo.carrier_name : convo.company_name} - {convo.shipment_number}</span>
                                    <span style={{ display: 'inline-block' }}>{new Date(convo.messages[convo.messages.length - 1].time_sent).toLocaleString()}</span>
                                </div>
                                <div>
                                    <p>{convo.messages[convo.messages.length - 1].text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>}
        </div>
    )
}

export default Conversations;