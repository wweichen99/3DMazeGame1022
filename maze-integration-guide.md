# Maze 3D - POI System Integration Guide

## 📦 文件清单

我已经为你准备了完整的集成文件：

1. **maze-poi.js** - POI系统核心代码
2. **index.html** - 集成后的HTML文件
3. 本README文件

## 🚀 集成步骤

### 步骤 1: 保存文件

**保存 maze-poi.js:**
- 将第一个 artifact 的内容保存为 `assets/js/maze-poi.js`

**更新 index.html:**
- 用第二个 artifact 的内容替换你的 `index.html`
- 或者手动添加相关的 `<style>` 和 `<script>` 标签

### 步骤 2: 放置平面图

将你的建筑俯视图文件放在正确位置：

```
your-project/
├── assets/
│   ├── images/
│   │   └── floorplan.png    ← 放在这里
│   └── js/
│       └── maze-poi.js      ← 新文件
├── index.html               ← 更新此文件
└── ...
```

如果你的平面图在其他位置，修改 `maze-poi.js` 中的路径：

```javascript
// 在 maze-poi.js 的 init() 方法中
this.floorplanImage.src = 'your/path/to/floorplan.png';
```

### 步骤 3: 调整 POI 坐标

1. 在浏览器中打开项目
2. 点击右上角的迷你地图
3. 在控制台查看坐标输出：`Original image coordinates: x: 123, y: 456`
4. 根据你想要的起点和终点位置，更新 `maze-poi.js` 中的坐标：

```javascript
this.pois = {
    start: {
        x: 80,    // ← 改为你的起点 x 坐标
        y: 120,   // ← 改为你的起点 y 坐标
        color: '#00cc00',
        label: 'Start'
    },
    goal: {
        x: 920,   // ← 改为你的终点 x 坐标
        y: 650,   // ← 改为你的终点 y 坐标
        color: '#cc0000',
        label: 'Goal'
    }
};
```

## 🔧 与现有代码集成

### 如果你想在 maze3d.js 中使用 POI 数据：

```javascript
// 获取起点坐标（归一化 0-1）
const startPos = poiSystem.getPOINormalized('start');
console.log(startPos); // { x: 0.0625, y: 0.125 }

// 获取终点坐标（归一化 0-1）
const goalPos = poiSystem.getPOINormalized('goal');
console.log(goalPos); // { x: 0.71875, y: 0.677 }
```

### 动态更新 POI 位置：

```javascript
// 更新起点位置到新坐标
poiSystem.updatePOI('start', 150, 200);

// 更新终点位置
poiSystem.updatePOI('goal', 800, 600);
```

## 🎨 自定义样式

### 修改迷你地图大小：

在 `maze-poi.js` 中修改：

```javascript
const maxSize = 300; // 改为你想要的尺寸，如 400
```

### 修改 POI 颜色：

```javascript
start: {
    color: '#00cc00',  // 改为任意颜色，如 '#00ff00'
    // ...
}
```

### 修改标签文字：

```javascript
start: {
    label: 'Start'  // 改为任意文字，如 'Entrance'
    // ...
}
```

## 🐛 故障排除

### 问题 1: 平面图不显示

**解决方案：**
1. 检查控制台是否有错误信息
2. 确认 `floorplan.png` 路径正确
3. 确认图片文件存在且可访问
4. 尝试使用绝对路径测试

### 问题 2: POI 位置不准确

**解决方案：**
1. 点击地图获取准确坐标
2. 确认你的平面图尺寸正确
3. 调整 POI 的 x, y 值

### 问题 3: 与旧 minimap 冲突

**解决方案：**
1. 在 `index.html` 中注释掉旧的 minimap 脚本
2. 隐藏旧的 map div（已在样式中处理）
3. 或者完全删除旧代码

## 📝 代码结构说明

```
MazePOISystem
├── constructor()        // 初始化系统
├── init()              // 加载平面图
├── render()            // 渲染地图和POI
├── drawPOI()           // 绘制单个POI标记
├── updatePOI()         // 更新POI位置
└── getPOINormalized()  // 获取归一化坐标（用于3D集成）
```

## 📚 进阶使用

### 添加更多POI点：

```javascript
this.pois = {
    start: { x: 80, y: 120, color: '#00cc00', label: 'Start' },
    goal: { x: 920, y: 650, color: '#cc0000', label: 'Goal' },
    checkpoint1: { x: 400, y: 300, color: '#ffaa00', label: 'CP1' },
    checkpoint2: { x: 600, y: 500, color: '#ffaa00', label: 'CP2' }
};

// 在 render() 中添加绘制调用
this.drawPOI(this.pois.checkpoint1, scaleX, scaleY);
this.drawPOI(this.pois.checkpoint2, scaleX, scaleY);
```

### 添加玩家位置指示器：

```javascript
// 添加方法到 MazePOISystem
updatePlayerPosition(x, y) {
    // 绘制玩家位置
    this.ctx.fillStyle = '#0088ff';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 4, 0, Math.PI * 2);
    this.ctx.fill();
}
```

## ✅ 测试清单

- [ ] 平面图正确显示
- [ ] 起点标记显示正确
- [ ] 终点标记显示正确
- [ ] 点击地图可获取坐标
- [ ] 在不同浏览器中测试
- [ ] 检查控制台无错误

## 💡 提示

- 保存修改后刷新页面查看效果
- 使用浏览器开发者工具查看控制台输出
- 可以暂时保留旧的 minimap 代码作为备份
- 测试成功后再完全移除旧代码

## 🆘 需要帮助？

如果遇到问题：
1. 检查控制台错误信息
2. 确认所有文件路径正确
3. 验证平面图文件可访问
4. 比对代码是否完整复制

---

**祝集成顺利！** 🎉
