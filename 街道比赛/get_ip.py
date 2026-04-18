#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
获取本地局域网IP并生成配置文件
"""

import socket
import os
import sys


def get_local_ip():
    """获取本地局域网IP地址"""
    try:
        # 创建一个UDP socket
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # 连接到一个公共IP，不需要实际连接成功
        s.connect(('8.8.8.8', 80))
        # 获取本地IP
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return '127.0.0.1'


def generate_config():
    """生成配置文件"""
    local_ip = get_local_ip()
    
    # 生成配置文件内容
    config_content = f'''
// 自动生成的配置文件
// 请勿手动修改
const SERVER_CONFIG = {{
    localIP: "{local_ip}",
    port: 3000
}};
'''
    
    # 确保js目录存在
    os.makedirs('js', exist_ok=True)
    
    # 写入配置文件
    with open('js/config.js', 'w', encoding='utf-8') as f:
        f.write(config_content)
    
    # 使用ASCII字符避免编码问题
    print("配置文件生成成功！")
    print(f"局域网IP: {local_ip}")
    print(f"二维码将使用: http://{local_ip}:3000/index.html")


if __name__ == '__main__':
    generate_config()
