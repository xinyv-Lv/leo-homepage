---
title: "Vue 3 组合式 API 入门指南"
date: 2025-09-18
category: tech
tags: [Vue, JavaScript, 前端开发]
summary: "详细介绍 Vue 3 组合式 API 的使用方法和最佳实践，帮助开发者更好地理解现代 Vue 开发模式。"
---

# Vue 3 组合式 API 入门指南

Vue 3 引入了组合式 API（Composition API），这是 Vue 2 选项式 API 的替代方案。组合式 API 提供了更好的类型推导、代码组织和逻辑复用能力。

## 什么是组合式 API？

组合式 API 是一套新的 API，允许我们使用函数而不是声明选项的方式编写 Vue 组件。它让我们能够更好地组织组件逻辑，特别是在处理复杂组件时。

## 基本用法

### setup 函数

```javascript
import { ref, reactive, computed } from 'vue'

export default {
  setup() {
    // 响应式数据
    const count = ref(0)
    const state = reactive({
      name: 'Vue 3',
      version: '3.0'
    })
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 方法
    const increment = () => {
      count.value++
    }
    
    return {
      count,
      state,
      doubleCount,
      increment
    }
  }
}
```

### 在模板中使用

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

## 优势

1. **更好的类型推导**：TypeScript 支持更好
2. **逻辑复用**：可以轻松提取和复用逻辑
3. **代码组织**：相关逻辑可以组织在一起
4. **性能优化**：更好的 tree-shaking 支持

## 总结

组合式 API 是 Vue 3 的重要特性，虽然学习曲线可能比选项式 API 陡峭，但它提供了更强大和灵活的开发体验。建议在新项目中优先使用组合式 API。
