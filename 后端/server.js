const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const publicPath = path.join(__dirname, '../');
app.use(express.static(publicPath));

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const bookingsFile = path.join(dataDir, 'bookings.json');
const contactsFile = path.join(dataDir, 'contacts.json');

function readJsonFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`读取文件错误 ${filePath}:`, error);
        return [];
    }
}

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`写入文件错误 ${filePath}:`, error);
        return false;
    }
}

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/api/bookings', (req, res) => {
    const bookings = readJsonFile(bookingsFile);
    res.json({
        success: true,
        data: bookings,
        total: bookings.length
    });
});

app.post('/api/bookings', (req, res) => {
    const { name, phone, address, serviceType, serviceContent, appointmentTime, notes } = req.body;
    
    if (!name || !phone || !serviceType) {
        return res.status(400).json({
            success: false,
            message: '请填写必填信息：姓名、电话、服务类型'
        });
    }
    
    const bookings = readJsonFile(bookingsFile);
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
    
    bookings.push(newBooking);
    
    if (writeJsonFile(bookingsFile, bookings)) {
        res.json({
            success: true,
            message: '预约成功！我们会尽快与您联系。',
            data: newBooking
        });
    } else {
        res.status(500).json({
            success: false,
            message: '预约保存失败，请稍后重试'
        });
    }
});

app.put('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const bookings = readJsonFile(bookingsFile);
    const index = bookings.findIndex(b => b.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: '预约记录不存在'
        });
    }
    
    bookings[index] = {
        ...bookings[index],
        ...updateData,
        updateTime: new Date().toISOString()
    };
    
    if (writeJsonFile(bookingsFile, bookings)) {
        res.json({
            success: true,
            message: '更新成功',
            data: bookings[index]
        });
    } else {
        res.status(500).json({
            success: false,
            message: '更新失败'
        });
    }
});

app.delete('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    
    const bookings = readJsonFile(bookingsFile);
    const filtered = bookings.filter(b => b.id !== id);
    
    if (filtered.length === bookings.length) {
        return res.status(404).json({
            success: false,
            message: '预约记录不存在'
        });
    }
    
    if (writeJsonFile(bookingsFile, filtered)) {
        res.json({
            success: true,
            message: '删除成功'
        });
    } else {
        res.status(500).json({
            success: false,
            message: '删除失败'
        });
    }
});

app.get('/api/contacts', (req, res) => {
    const contacts = readJsonFile(contactsFile);
    res.json({
        success: true,
        data: contacts,
        total: contacts.length
    });
});

app.post('/api/contacts', (req, res) => {
    const { name, phone, message } = req.body;
    
    if (!name || !phone) {
        return res.status(400).json({
            success: false,
            message: '请填写姓名和电话'
        });
    }
    
    const contacts = readJsonFile(contactsFile);
    const newContact = {
        id: Date.now().toString(),
        name,
        phone,
        message: message || '',
        createTime: new Date().toISOString()
    };
    
    contacts.push(newContact);
    
    if (writeJsonFile(contactsFile, contacts)) {
        res.json({
            success: true,
            message: '提交成功！',
            data: newContact
        });
    } else {
        res.status(500).json({
            success: false,
            message: '提交失败，请稍后重试'
        });
    }
});

app.get('/api/qrcode-url', (req, res) => {
    const localIP = getLocalIP();
    const url = `http://${localIP}:${PORT}`;
    res.json({
        success: true,
        url: url,
        localIP: localIP,
        port: PORT
    });
});

app.get('/api/stats', (req, res) => {
    const bookings = readJsonFile(bookingsFile);
    const contacts = readJsonFile(contactsFile);
    
    const today = new Date().toDateString();
    const todayBookings = bookings.filter(b => new Date(b.createTime).toDateString() === today);
    
    const statusCount = {
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length
    };
    
    res.json({
        success: true,
        data: {
            totalBookings: bookings.length,
            todayBookings: todayBookings.length,
            totalContacts: contacts.length,
            statusCount
        }
    });
});

app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log('========================================');
    console.log('  社区银龄生活管家服务项目 - 服务器已启动');
    console.log('========================================');
    console.log(`  本地访问: http://localhost:${PORT}`);
    console.log(`  局域网访问: http://${localIP}:${PORT}`);
    console.log('========================================');
    console.log('  扫描二维码即可访问网页');
    console.log('  预约数据将保存在 data/bookings.json');
    console.log('========================================');
});
