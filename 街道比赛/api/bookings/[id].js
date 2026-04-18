module.exports = function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const { id } = req.query;
    
    if (!id) {
        res.status(400).json({
            success: false,
            message: '缺少预约ID'
        });
        return;
    }
    
    if (!global.bookings) {
        global.bookings = [];
    }
    
    const index = global.bookings.findIndex(b => b.id === id);
    
    if (index === -1) {
        res.status(404).json({
            success: false,
            message: '预约记录不存在'
        });
        return;
    }
    
    if (req.method === 'PUT') {
        const updateData = req.body;
        
        global.bookings[index] = {
            ...global.bookings[index],
            ...updateData,
            updateTime: new Date().toISOString()
        };
        
        res.status(200).json({
            success: true,
            message: '更新成功',
            data: global.bookings[index]
        });
    } else if (req.method === 'DELETE') {
        global.bookings = global.bookings.filter(b => b.id !== id);
        
        res.status(200).json({
            success: true,
            message: '删除成功'
        });
    } else {
        res.status(405).json({
            success: false,
            message: '方法不允许'
        });
    }
};
