function UndeliveredShipments({undeliveredShipments , user}){
    return(
        <div style={{width: '100%'}}>
            <h2>Undelivered Shipments</h2>
            {undeliveredShipments}
        </div>
    )
}

export default UndeliveredShipments;