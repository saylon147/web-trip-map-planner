# Web Trip Map Planner 项目规划

## 1. 项目定位

本项目是一个本地优先的 Web 行程资料整理应用。地图用于辅助定位、查看空间关系和估算自驾距离时间，但应用核心不是导航，也不是商业地图产品。

核心目标：

- 管理行程点。
- 整理每个行程点的资料、备注、链接和本地图片附件。
- 按行程点顺序估算自驾路线和分段距离时间。
- 本地保存、导入导出和备份行程资料。

非目标：

- 不做实时导航。
- 不做公交、骑行、步行等复杂路线模式。
- 不依赖百度/高德等商业地图 SDK。
- 不做账号系统、云同步或公开分享。
- 不上传用户本地图片素材。

---

## 2. 当前已实现状态

当前版本已完成：

1. Vite + React + TypeScript 项目骨架。
2. Leaflet 地图显示，底图使用 OpenStreetMap tile。
3. 默认地图中心：上海人民广场。
4. Nominatim 地点搜索。
5. 搜索结果可添加为行程点。
6. 地图显示行程点 Marker。
7. 右侧行程点列表：
   - 点击定位地图。
   - 删除。
   - 拖拽排序。
   - 收起 / 展开。
8. OSRM 自驾路线估算：
   - 按行程点列表顺序计算。
   - 地图绘制路线 Polyline。
   - 显示总距离和总耗时。
   - 显示分段行程，例如 A 到 B、B 到 C。
9. localStorage 保存 / 恢复。
10. JSON 导入 / 导出。

---

## 3. 推荐技术栈

### 3.1 前端框架

```txt
React + TypeScript + Vite
```

理由：

- 适合快速迭代本地 Web 应用。
- TypeScript 能约束行程点、路线、附件等结构。
- Vite 开发体验轻量直接。

### 3.2 地图能力

```txt
Leaflet + React Leaflet
OpenStreetMap tile
Nominatim
OSRM demo
```

定位：

- Leaflet 负责地图交互和图层显示。
- OpenStreetMap tile 只作为开发和个人低频使用阶段的底图。
- Nominatim 用于手动搜索地点。
- OSRM demo 用于估算自驾路线。

注意：

- 这些公共服务不适合高频、公开、多用户生产使用。
- 本项目当前定位为本地行程资料整理，低频使用不冲突。
- 如果未来变成公开服务，应替换为商业服务、自建服务或受控代理服务。

### 3.3 状态管理

```txt
Zustand
```

用于管理：

- 行程点列表。
- 选中行程点。
- 当前估算路线。
- UI 状态。

### 3.4 本地存储

短期：

```txt
localStorage
```

适合保存轻量 JSON，例如行程点、备注、链接。

中期：

```txt
IndexedDB
```

适合保存本地图片附件、较大的 JSON 备份、Blob 数据。

后续可以考虑：

```txt
JSZip
```

用于导出完整备份包，例如：

```txt
trip-backup.zip
  trip.json
  attachments/
    image-1.png
    image-2.jpg
```

---

## 4. 核心功能范围

### 4.1 当前 MVP 范围

第一阶段重点是形成行程点和路线估算闭环：

1. 地图显示。
2. 搜索地点。
3. 添加行程点。
4. 管理行程点。
5. 拖拽调整行程点顺序。
6. 按行程点顺序估算自驾路线。
7. 展示总距离、总耗时和分段距离时间。
8. 本地保存、恢复、导入、导出。

### 4.2 下一阶段重点

下一阶段重点从地图功能转向行程点资料管理：

1. 行程点详情面板。
2. 编辑行程点名称、地址、分类、备注。
3. 添加外部链接。
4. 添加计划游玩时长。
5. 添加开放时间、门票、预约信息等文本资料。
6. 导入本地图片附件并关联到行程点。
7. 使用 IndexedDB 保存图片附件。
8. 支持完整行程备份和恢复。

---

## 5. 推荐项目目录结构

```txt
web-trip-map-planner/
  package.json
  vite.config.ts
  tsconfig.json
  index.html
  README.md
  web-trip-map-planner-plan.md

  public/
    favicon.svg

  src/
    main.tsx
    App.tsx

    components/
      layout/
        AppLayout.tsx
        MapPanel.tsx
        SidePanel.tsx

      map/
        MapCanvas.tsx
        TripMarkers.tsx
        RouteLayer.tsx

      trip/
        SearchBox.tsx
        TripStopList.tsx
        RouteSummary.tsx
        TripActions.tsx
        TripStopDetail.tsx
        AttachmentList.tsx
        AttachmentPicker.tsx

      common/
        Button.tsx
        EmptyState.tsx
        SectionHeader.tsx

    services/
      geocoding.ts
      routing.ts
      storage.ts
      attachmentStorage.ts
      backup.ts

    store/
      tripStore.ts
      attachmentStore.ts

    types/
      trip.ts
      attachment.ts
      routing.ts

    utils/
      format.ts
      id.ts
      coordinates.ts

    styles/
      layout.css
      map.css
      side-panel.css
      detail-panel.css
```

---

## 6. 核心数据结构草案

### 6.1 行程点

```ts
export type TripStopCategory =
  | "city"
  | "attraction"
  | "hotel"
  | "restaurant"
  | "transport"
  | "shopping"
  | "custom";

export type TripStop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  category?: TripStopCategory;
  notes?: string;
  plannedDurationMinutes?: number;
  openHours?: string;
  ticketInfo?: string;
  source?: "search" | "map-click" | "import";
  linkIds: string[];
  attachmentIds: string[];
  createdAt: string;
  updatedAt: string;
};
```

### 6.2 外部链接

```ts
export type TripLink = {
  id: string;
  stopId: string;
  title: string;
  url: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
```

### 6.3 本地附件

附件只保存在本地，不上传服务器。

```ts
export type TripAttachment = {
  id: string;
  stopId: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  createdAt: string;
};
```

图片 Blob 存储在 IndexedDB 中：

```ts
type AttachmentBlobRecord = {
  key: string;
  blob: Blob;
};
```

### 6.4 路线结果

路线是辅助估算结果，不作为导航结果。

```ts
export type TripRouteLeg = {
  fromStopId: string;
  toStopId: string;
  fromName: string;
  toName: string;
  distanceMeters: number;
  durationSeconds: number;
};

export type TripRoute = {
  geometry: GeoJSON.LineString;
  distanceMeters: number;
  durationSeconds: number;
  legs: TripRouteLeg[];
  provider: "osrm";
  calculatedAt: string;
};
```

### 6.5 行程计划

```ts
export type TripPlan = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  stops: TripStop[];
  links: TripLink[];
  route?: TripRoute;
};
```

---

## 7. UI 设计方向

### 7.1 主布局

```txt
┌──────────────────────────────────────────┬──────────────────────────┐
│                                          │ Search                   │
│                                          │ Trip Stops               │
│                                          │ Route Estimate           │
│                MapCanvas                 │ Data                     │
│                                          │                          │
│                                          │ Stop Detail              │
│                                          │ Notes / Links / Images   │
└──────────────────────────────────────────┴──────────────────────────┘
```

### 7.2 右侧面板分区

1. 搜索区
   - 搜索地点。
   - 添加为行程点。

2. 行程点区
   - 列表。
   - 拖拽排序。
   - 删除。
   - 收起 / 展开。

3. 路线区
   - 按当前行程点顺序估算自驾路线。
   - 显示总距离、总耗时。
   - 显示分段行程。
   - 不提供额外交换起终点按钮，顺序由行程点拖拽决定。

4. 数据区
   - 清空。
   - 保存。
   - 恢复。
   - 导出 JSON。
   - 导入 JSON。
   - 后续扩展为导出 / 导入 zip 备份。

5. 行程点详情区
   - 名称。
   - 地址。
   - 分类。
   - 备注。
   - 游玩时长。
   - 开放时间。
   - 门票 / 预约信息。
   - 外部链接。
   - 本地图片附件。

---

## 8. 路线交互规则

1. 路线始终按行程点列表顺序计算。
2. 行程点列表第一项是起点。
3. 行程点列表最后一项是终点。
4. 中间项是途经点。
5. 用户通过拖拽行程点列表调整路线顺序。
6. 添加、删除、拖拽、导入、清空行程点后，旧路线失效并清除。
7. 用户手动点击“计算路线”后重新请求 OSRM。
8. 不自动高频重新计算路线，避免滥用 OSRM demo 服务。

---

## 9. 本地图片附件设计

### 9.1 用户行为

用户在行程点详情中选择本地图片：

- 截图。
- 门票图片。
- 酒店信息截图。
- 餐厅菜单截图。
- 交通说明截图。

这些图片只在本地浏览器中保存和展示，不上传。

### 9.2 存储策略

不使用 localStorage 存图片。

推荐：

```txt
IndexedDB
```

原因：

- localStorage 容量小。
- localStorage 只能保存字符串。
- 图片转 base64 后体积会变大。
- IndexedDB 适合保存 Blob。

### 9.3 备份策略

短期：

- JSON 只导出行程点、备注、链接和附件元数据。
- 图片附件暂不包含在 JSON 中。

中期：

- 支持 zip 备份。
- zip 中包含 `trip.json` 和附件图片。

---

## 10. Service 封装设计

### 10.1 geocoding.ts

职责：

- 调用 Nominatim 搜索地点。
- 返回候选地点。
- 控制请求频率。
- 后续可替换 provider。

注意：

- 不做批量 geocoding。
- 不在输入过程中高频请求。
- 公共 Nominatim 仅用于开发和低频手动搜索。

### 10.2 routing.ts

职责：

- 使用 OSRM demo 估算自驾路线。
- 生成总路线 geometry。
- 解析 OSRM legs，生成分段行程。

注意：

- 只支持 driving。
- 不做导航级准确性承诺。
- 不自动高频请求。

### 10.3 storage.ts

职责：

- 保存轻量行程 JSON。
- 从 localStorage 恢复。
- 导入 / 导出 JSON。

### 10.4 attachmentStorage.ts

职责：

- 使用 IndexedDB 保存图片 Blob。
- 根据 attachment id 读取 Blob。
- 删除附件时同步删除 Blob。

### 10.5 backup.ts

职责：

- 后续生成 zip 备份。
- 从 zip 恢复行程和附件。

---

## 11. OSM 使用策略

当前项目定位与 OSM 轻量使用不冲突，但需要遵守公共服务边界：

1. OpenStreetMap 官方 tile 适合开发和个人低频使用，不适合公开高流量服务。
2. Nominatim 公共服务适合手动低频搜索，不适合批量 geocoding。
3. OSRM demo 适合开发测试和低频估算，不适合作为生产 SLA 服务。
4. 页面必须保留 OSM attribution。
5. 如果未来公开部署给多人使用，应替换为商业服务、自建服务或受控代理服务。

---

## 12. 坐标和 GeoJSON 注意事项

Leaflet 使用：

```ts
[lat, lng]
```

GeoJSON 使用：

```ts
[lng, lat]
```

OSRM URL 使用：

```txt
lng,lat
```

建议保留工具函数：

```ts
export function toLeafletLatLng(point: { lat: number; lng: number }): [number, number] {
  return [point.lat, point.lng];
}

export function toGeoJsonPosition(point: { lat: number; lng: number }): [number, number] {
  return [point.lng, point.lat];
}

export function toOsrmCoordinate(point: { lat: number; lng: number }): string {
  return `${point.lng},${point.lat}`;
}
```

---

## 13. 后续开发优先级

建议从高到低：

1. 行程点详情面板。
2. 编辑行程点基础信息。
3. 分类标签。
4. 备注字段。
5. 外部链接管理。
6. 计划游玩时长。
7. 本地图片附件导入和展示。
8. IndexedDB 附件存储。
9. JSON 数据结构升级和迁移。
10. zip 完整备份导入导出。
11. 多日行程分组。
12. 每日独立路线估算。
13. 绘制工具。
14. 地图服务替换或自建服务。

---

## 14. 下一轮实现建议

建议下一轮做：

```txt
行程点详情面板
```

目标：

1. 点击行程点后显示详情。
2. 可编辑名称、地址、分类、备注。
3. 可填写计划游玩时长。
4. 可添加外部链接。
5. 保存后同步到当前行程点。

先不要立刻做图片附件，因为图片需要 IndexedDB 和备份策略，复杂度更高。等文本资料结构稳定后，再接本地图片附件。

