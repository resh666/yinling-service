module.exports = function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const bookings = global.bookings || [];
    
    if (req.method === 'GET') {
        res.status(200).json({
            success: true,
            data: bookings,
            total: bookings.length
        });
    } else if (req.method === 'POST') {
        const { name, phone, address, serviceType, serviceContent, appointmentTime, notes } = req.body;
        
        if (!name || !phone || !serviceType) {
            res.status(400).json({
                success: false,
                message: '请填写必填信息：姓名、电话、服务类型'
            });
            return;
        }
        
        if (!global.bookings) {
            global.bookings = [];
        }
        
        const newBooking = {
            id: Date.now().toString(),
            name,
            phone,
            address: address || '',
            serviceType,
            serviceContent: serviceContent || '',
            appointmentTime: appointmentTime || '',
            notes: notes || '',
            status: 'pending',
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString()
        };
        
        global.bookings.push(newBooking);
        
        res.status(200).json({
            success: true,
            message: '预约成功！我们会尽快与您联系。',
            data: newBooking
        });
    } else {
        res.status(405).json({
            success: false,
            message: '方法不允许'
        });
    }
};
