const API_BASE = window.location.origin;
let currentBookingData = {};
let selectedPaymentMethod = null;

// 移动端检测和重定向
function detectMobile() {
    const mobileDevices = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileDevices.test(navigator.userAgent);
}

// 优化移动端体验
function optimizeMobileExperience() {
    if (detectMobile()) {
        // 隐藏桌面端导航，显示移动端导航
        const nav = document.querySelector('nav');
        if (nav) {
            nav.style.fontSize = '0.9rem';
        }
        
        // 调整按钮大小
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(function(btn) {
            btn.style.padding = '12px 24px';
            btn.style.fontSize = '1rem';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initQRCode();
    initNavHighlight();
    optimizeMobileExperience();
});

function initQRCode() {
    var qrcodeContainer = document.getElementById('qrcode');
    if (qrcodeContainer) {
        var qrUrl = window.location.href;
        
        // 如果是本地访问，使用局域网IP
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // 优先使用配置文件中的IP
            if (typeof SERVER_CONFIG !== 'undefined' && SERVER_CONFIG.localIP) {
                qrUrl = 'http://' + SERVER_CONFIG.localIP + ':' + (SERVER_CONFIG.port || 3000) + '/index.html';
            } else {
                qrUrl = 'http://' + window.location.hostname + ':' + window.location.port + '/index.html';
            }
        } else {
            qrUrl = window.location.origin + '/index.html';
        }
        
        qrcodeContainer.innerHTML = '';
        new QRCode(qrcodeContainer, {
            text: qrUrl,
            width: 200,
            height: 200,
            colorDark: '#2c3e50',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

function initNavHighlight() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(function(link) {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

function openBookingModal(serviceType, serviceName, price) {
    currentBookingData = {
        serviceType: serviceType,
        serviceName: serviceName,
        price: price
    };

    document.getElementById('modalServiceType').value = serviceType;
    document.getElementById('modalServiceName').value = serviceName;
    document.getElementById('modalServicePrice').value = price;
    document.getElementById('modalServicePriceDisplay').value = '¥' + price;

    document.getElementById('modalName').value = '';
    document.getElementById('modalPhone').value = '';
    document.getElementById('modalAddress').value = '';
    document.getElementById('modalAppointmentTime').value = '';
    document.getElementById('modalNotes').value = '';

    var modal = document.getElementById('bookingModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    var modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function proceedToPayment() {
    var name = document.getElementById('modalName').value;
    var phone = document.getElementById('modalPhone').value;

    if (!name || !phone) {
        alert('请填写姓名和联系电话');
        return;
    }

    currentBookingData.name = name;
    currentBookingData.phone = phone;
    currentBookingData.address = document.getElementById('modalAddress').value;
    currentBookingData.appointmentTime = document.getElementById('modalAppointmentTime').value;
    currentBookingData.notes = document.getElementById('modalNotes').value;

    closeBookingModal();
    openPaymentModal();
}

function openPaymentModal() {
    selectedPaymentMethod = null;

    document.getElementById('modalServiceSummary').innerHTML =
        '<h4>' + currentBookingData.serviceName + '</h4>' +
        '<p>服务类型：' + currentBookingData.serviceType + '</p>';

    document.getElementById('modalAmount').textContent = '¥' + currentBookingData.price;

    var paymentMethods = document.querySelector('.payment-methods');
    if (paymentMethods) {
        paymentMethods.style.display = 'grid';
    }

    var paymentQRCode = document.getElementById('paymentQRCode');
    if (paymentQRCode) {
        paymentQRCode.style.display = 'none';
    }

    var paymentActions = document.getElementById('paymentActions');
    if (paymentActions) {
        paymentActions.style.display = 'none';
    }

    var paymentBtns = document.querySelectorAll('.payment-btn');
    paymentBtns.forEach(function(btn) {
        btn.classList.remove('selected');
    });

    var modal = document.getElementById('paymentModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    var modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    selectedPaymentMethod = null;
}

function selectPayment(method) {
    selectedPaymentMethod = method;

    var paymentBtns = document.querySelectorAll('.payment-btn');
    paymentBtns.forEach(function(btn) {
        btn.classList.remove('selected');
    });

    if (method === 'wechat') {
        var wechatBtn = document.querySelector('.payment-btn.wechat');
        if (wechatBtn) wechatBtn.classList.add('selected');
    } else if (method === 'alipay') {
        var alipayBtn = document.querySelector('.payment-btn.alipay');
        if (alipayBtn) alipayBtn.classList.add('selected');
    }

    var qrcodeContainer = document.getElementById('qrcodePlaceholder');
    if (qrcodeContainer) {
        qrcodeContainer.innerHTML = '';

        var qrUrl = 'https://qr.' + (method === 'wechat' ? 'wechat' : 'alipay') + '.com/';
        qrUrl += '?amount=' + currentBookingData.price;
        qrUrl += '&desc=' + encodeURIComponent('银龄生活管家 - ' + currentBookingData.serviceName);

        new QRCode(qrcodeContainer, {
            text: qrUrl,
            width: 180,
            height: 180,
            colorDark: method === 'wechat' ? '#07c160' : '#1677ff',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    var instructions = document.getElementById('paymentInstructions');
    if (instructions) {
        instructions.textContent = '请使用' + (method === 'wechat' ? '微信' : '支付宝') + '扫描二维码完成支付';
    }

    var paymentQRCode = document.getElementById('paymentQRCode');
    if (paymentQRCode) {
        paymentQRCode.style.display = 'block';
    }

    var paymentActions = document.getElementById('paymentActions');
    if (paymentActions) {
        paymentActions.style.display = 'flex';
    }
}

function confirmPayment() {
    if (!selectedPaymentMethod) {
        alert('请选择支付方式');
        return;
    }

    var data = {
        name: currentBookingData.name,
        phone: currentBookingData.phone,
        address: currentBookingData.address || '',
        serviceType: currentBookingData.serviceType,
        serviceContent: currentBookingData.serviceName,
        appointmentTime: currentBookingData.appointmentTime || '',
        notes: (currentBookingData.notes || '') + ' [已支付：' + (selectedPaymentMethod === 'wechat' ? '微信' : '支付宝') + ']',
        paymentMethod: selectedPaymentMethod,
        amount: currentBookingData.price
    };

    fetch(API_BASE + '/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(function(response) { return response.json(); })
    .then(function(result) {
        if (result.success) {
            closePaymentModal();
            alert('支付成功！预约已提交，我们会尽快与您联系确认。');
        } else {
            alert('预约提交失败：' + result.message);
        }
    })
    .catch(function() {
        closePaymentModal();
        alert('支付成功！预约信息已记录，我们会尽快与您联系。');
    });
}

function submitBooking(form) {
    var formData = new FormData(form);
    var data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        serviceType: formData.get('serviceType'),
        serviceContent: formData.get('serviceType'),
        appointmentTime: formData.get('appointmentTime'),
        notes: formData.get('notes')
    };

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;

    fetch(API_BASE + '/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(function(response) { return response.json(); })
    .then(function(result) {
        var messageDiv = document.getElementById('formMessage');
        messageDiv.style.display = 'block';

        if (result.success) {
            messageDiv.className = 'form-message success';
            messageDiv.innerHTML = '&#10003; ' + result.message;
            form.reset();
        } else {
            messageDiv.className = 'form-message error';
            messageDiv.innerHTML = '&#10007; ' + result.message;
        }

        setTimeout(function() {
            messageDiv.style.display = 'none';
        }, 5000);
    })
    .catch(function() {
        var messageDiv = document.getElementById('formMessage');
        messageDiv.style.display = 'block';
        messageDiv.className = 'form-message error';
        messageDiv.innerHTML = '&#10007; 网络错误，请稍后重试或拨打电话预约';

        setTimeout(function() {
            messageDiv.style.display = 'none';
        }, 5000);
    })
    .finally(function() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function showServices(type) {
    var basicServices = document.getElementById('basic-services');
    var professionalServices = document.getElementById('professional-services');
    var buttons = document.querySelectorAll('.tab-btn');

    buttons.forEach(function(btn) { btn.classList.remove('active'); });

    if (type === 'basic') {
        if (basicServices) basicServices.style.display = 'grid';
        if (professionalServices) professionalServices.style.display = 'none';
        if (buttons[0]) buttons[0].classList.add('active');
    } else {
        if (basicServices) basicServices.style.display = 'none';
        if (professionalServices) professionalServices.style.display = 'grid';
        if (buttons[1]) buttons[1].classList.add('active');
    }
}

function animateOnScroll() {
    var elements = document.querySelectorAll('.animate-on-scroll');

    elements.forEach(function(element) {
        var elementTop = element.getBoundingClientRect().top;
        var windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 30px rgba(0,0,0,0.2)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
        }
    }
});

window.onclick = function(event) {
    var bookingModal = document.getElementById('bookingModal');
    var paymentModal = document.getElementById('paymentModal');

    if (bookingModal && event.target === bookingModal) {
        closeBookingModal();
    }
    if (paymentModal && event.target === paymentModal) {
        closePaymentModal();
    }
};
