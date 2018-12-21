// import { Promise } from 'es6-promise';

async function sleep(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms);
    });
}

async function randomDelay() {
    const randomTime = Math.round(Math.random() * 1000)
    return sleep(randomTime)
}

class ShipmentSearchIndex {
    async updateShipment(id: string, shipmentData: any) {
        const startTime = new Date()
        await randomDelay();
        const endTime = new Date();
        console.log(`update ${id}@${
            startTime.toISOString()
            } finished@${
            endTime.toISOString()
            }`
        );
        return { startTime, endTime };
    }
}

// Implementation needed
interface ShipmentUpdateListenerInterface {
    receiveUpdate(id: string, shipmentData: any);
}

class Shipment implements ShipmentUpdateListenerInterface {
    searchIndex: any;
    queue = [];
    constructor() {
        this.searchIndex = new ShipmentSearchIndex();
        setInterval(() => {
            if (this.queue[0] && this.queue[0].status === 'complete') {
                this.queue.splice(0, 1);
            } else if (this.queue[0] && this.queue[0].status === 'pending') {
                this.queue[0].callback.call(this);
            }
        },1000);
    }
    receiveUpdate(id: string, shipmentData: any) {
        console.log(this.queue);
        try {
            this.searchIndex.updateShipment(id, shipmentData).then(() => { 
                this.queue[0].status = 'complete';
            });
        } catch (e) {
            console.log('error', e);
        }
    }
    update(id, data) {
        let obj = { id, data, status:'pending' };
        this.queue.push({ callback: this.receiveUpdate.bind(this, id, data),status:'pending' });
        
    }
}



const shipmentInstance = new Shipment();

shipmentInstance.update('customer1', { a: 10 });
shipmentInstance.update('customer1', { a: 20 });


