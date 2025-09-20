# 博客文章分类说明

本目录下的文章通过文件夹结构进行分类管理，无需在文章内部手动指定分类。

## 分类文件夹

- `llm/` - LLM（大语言模型）相关文章
- `cv/` - CV（计算机视觉）相关文章  
- `study/` - Study（学习笔记）相关文章
- `project/` - Project（项目经验）相关文章
- `tools/` - 工具推荐相关文章
- `books/` - 读书笔记相关文章
- `design/` - 设计思考相关文章
- `others/` - 其他文章

## 使用方法

1. 将 `.md` 文件放入对应的分类文件夹
2. 文章会自动归类到对应分类，无需在 Front Matter 中设置 `category`
3. 如果文章放在根目录 `posts/` 下，仍可通过 Front Matter 的 `category` 字段指定分类

## 文章格式

每篇文章需要包含 Front Matter：

```markdown
---
title: "文章标题"
date: 2025-09-18
tags: [标签1, 标签2]
summary: "文章摘要"
---

# 文章内容
```

分类会根据文件所在的文件夹自动确定。
