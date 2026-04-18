module.exports = function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method === 'GET') {
        const bookings = global.bookings || [];
        
        const today = new Date().toDateString();
        const todayBookings = bookings.filter(b => new Date(b.createTime).toDateString() === today);
        
        const statusCount = {
            pending: bookings.filter(b => b.status === 'pending').length,
            confirmed: bookings.filter(b => b.status === 'confirmed').length,
            completed: bookings.filter(b => b.status === 'completed').length,
            cancelled: bookings.filter(b => b.status === 'cancelled').length
        };
        
        res.status(200).json({
            success: true,
            data: {
                totalBookings: bookings.length,
                todayBookings: todayBookings.length,
                totalContacts: 0,
                statusCount
            }
        });
    } else {
        res.status(405).json({
            success: false,
            message: '方法不允许'
        });
    }
};
