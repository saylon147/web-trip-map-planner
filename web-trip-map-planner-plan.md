# Web Trip Map Planner 项目规划

## 1. 项目目标

开发一个基于 Web 浏览器的地图行程规划应用。核心界面由两部分组成：

- 左侧或主区域：交互式地图 Canvas，用于显示底图、地点标记、路线、绘制内容。
- 右侧功能面板：用于搜索地点、添加行程点、管理行程顺序、调用路线规划、保存和恢复行程。

第一阶段目标是完成一个可运行的 MVP，不追求复杂账号系统、云端同步或商业级地图服务，优先完成核心业务闭环。

---

## 2. 推荐技术栈

### 2.1 前端框架

建议使用：

```txt
React + TypeScript + Vite
```

理由：

- 启动快，适合原型开发。
- TypeScript 对地图数据、行程数据、GeoJSON 结构更安全。
- React 生态中有成熟的地图封装和状态管理方案。

### 2.2 地图库

第一版推荐：

```txt
Leaflet + React Leaflet
```

理由：

- 轻量，上手快。
- 适合实现地图拖拽、缩放、Marker、Polyline、Popup。
- 插件生态成熟，适合 MVP。
- 比 MapLibre GL JS 和 OpenLayers 更适合第一版业务验证。

### 2.3 绘制工具

推荐：

```txt
Leaflet-Geoman
```

用于支持：

- 手动添加点、线、区域。
- 编辑路线或图形。
- 删除图形。
- 导出 GeoJSON。

### 2.4 地点搜索 / Geocoding

开发阶段可使用：

```txt
Nominatim API
```

注意：

- Nominatim 公共服务适合开发测试。
- 正式上线前应考虑自建 Nominatim / Photon / Pelias，或接入商业 geocoding provider。
- 需要在服务封装中预留 provider 替换能力。

### 2.5 路线规划 / Routing

开发阶段可使用：

```txt
OSRM Demo API
```

后续可替换为：

```txt
自建 OSRM Server
GraphHopper
商业地图 Routing API
```

第一版只需要支持：

- 根据行程点顺序计算路线。
- 返回路线 geometry。
- 在地图上绘制 polyline。
- 显示总距离和总耗时。

### 2.6 状态管理

第一版可以使用：

```txt
Zustand
```

理由：

- 比 Redux 简洁。
- 适合管理行程点、当前选中点、路线结果、绘制状态。
- 与 React 结合简单。

---

## 3. 核心功能范围

### 3.1 MVP 必须实现

第一阶段必须实现以下功能：

1. 显示地图
   - 默认中心点。
   - 支持缩放。
   - 支持拖拽。

2. 搜索地点
   - 输入关键词。
   - 调用 geocoding service。
   - 展示候选结果。
   - 点击候选结果后地图定位。

3. 添加行程点
   - 从搜索结果添加到行程。
   - 点击地图添加自定义点。
   - 行程点显示在地图上。
   - 行程点显示在右侧列表中。

4. 管理行程点
   - 删除行程点。
   - 选中行程点。
   - 点击右侧列表时地图定位到该点。
   - 支持调整顺序，后续可用拖拽排序。

5. 路线规划
   - 至少两个行程点时可以计算路线。
   - 调用 routing service。
   - 在地图上绘制路线。
   - 在右侧显示总距离、总耗时。

6. 保存 / 恢复
   - 第一版可以先保存到 localStorage。
   - 支持导出 JSON。
   - 支持导入 JSON。

7. 绘制工具
   - 手动画线。
   - 手动画区域。
   - 编辑或删除图形。
   - 将绘制结果保存为 GeoJSON。

---

## 4. 后续增强功能

这些功能不建议第一阶段就做，可以放到第二阶段：

1. 多日行程
   - Day 1 / Day 2 / Day 3 分组。
   - 每天独立路线。

2. 地点分类
   - 城市。
   - 景点。
   - 酒店。
   - 餐厅。
   - 交通枢纽。
   - 自定义地点。

3. 路线模式
   - driving。
   - walking。
   - cycling。
   - public transport，较复杂，可后置。

4. 路线分段
   - A 到 B。
   - B 到 C。
   - 每段显示距离和时间。

5. 云端保存
   - 用户账号。
   - 后端数据库。
   - 分享链接。

6. 地图服务替换
   - 自建 OSRM。
   - 自建 Nominatim / Photon。
   - MapLibre 矢量地图。
   - 第三方商业地图服务。

---

## 5. 推荐项目目录结构

```txt
web-trip-map-planner/
  package.json
  vite.config.ts
  tsconfig.json
  index.html
  README.md
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
        DrawingLayer.tsx
        MapClickHandler.tsx

      trip/
        SearchBox.tsx
        SearchResults.tsx
        TripStopList.tsx
        TripStopItem.tsx
        RouteSummary.tsx
        TripActions.tsx

      common/
        Button.tsx
        Panel.tsx
        EmptyState.tsx

    services/
      geocoding.ts
      routing.ts
      storage.ts
      geojson.ts

    store/
      tripStore.ts
      mapStore.ts

    types/
      geo.ts
      trip.ts
      routing.ts

    utils/
      format.ts
      id.ts
      coordinates.ts

    styles/
      global.css
      layout.css
      map.css
      side-panel.css
```

---

## 6. 核心数据结构

### 6.1 行程地点

```ts
export type TripStopType =
  | "city"
  | "poi"
  | "hotel"
  | "restaurant"
  | "transport"
  | "custom";

export type TripStop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: TripStopType;
  address?: string;
  notes?: string;
  source?: "search" | "map-click" | "import";
};
```

### 6.2 路线结果

```ts
export type TripRoute = {
  id: string;
  stopIds: string[];
  geometry: GeoJSON.LineString;
  distanceMeters: number;
  durationSeconds: number;
  provider: "osrm" | "graphhopper" | "manual";
};
```

### 6.3 绘制图形

```ts
export type DrawingFeature = {
  id: string;
  name?: string;
  feature: GeoJSON.Feature;
  createdAt: string;
  updatedAt: string;
};
```

### 6.4 行程计划

```ts
export type TripPlan = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  stops: TripStop[];
  routes: TripRoute[];
  drawings: DrawingFeature[];
};
```

---

## 7. 状态管理设计

建议使用 Zustand 创建 `tripStore`。

### 7.1 tripStore 需要管理

```ts
type TripState = {
  trip: TripPlan;
  selectedStopId?: string;
  selectedRouteId?: string;

  addStop: (stop: TripStop) => void;
  updateStop: (id: string, patch: Partial<TripStop>) => void;
  removeStop: (id: string) => void;
  selectStop: (id?: string) => void;
  reorderStops: (fromIndex: number, toIndex: number) => void;

  setRoute: (route: TripRoute) => void;
  clearRoutes: () => void;

  addDrawing: (drawing: DrawingFeature) => void;
  updateDrawing: (id: string, patch: Partial<DrawingFeature>) => void;
  removeDrawing: (id: string) => void;

  saveToLocal: () => void;
  loadFromLocal: () => void;
  exportJson: () => string;
  importJson: (json: string) => void;
};
```

### 7.2 mapStore 可选

如果地图状态复杂，可以单独维护：

```ts
type MapState = {
  center: [number, number];
  zoom: number;
  setView: (center: [number, number], zoom?: number) => void;
};
```

第一版也可以不单独做 mapStore，直接在 MapCanvas 内处理。

---

## 8. Service 封装设计

### 8.1 geocoding.ts

职责：把搜索关键词转成地点候选列表。

```ts
export type GeocodingResult = {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type?: string;
  address?: string;
  raw?: unknown;
};

export async function searchPlaces(query: string): Promise<GeocodingResult[]> {
  // 第一版使用 Nominatim
  // 后续可以切换 Photon / Pelias / commercial provider
}
```

Nominatim 查询示例：

```txt
https://nominatim.openstreetmap.org/search?format=json&q=Tokyo&limit=5
```

注意：

- 需要处理空 query。
- 需要处理请求失败。
- 需要做 debounce，避免用户每输入一个字符就请求。
- 不要在正式环境高频调用公共 Nominatim 服务。

### 8.2 routing.ts

职责：根据行程点计算路线。

```ts
export type RoutingProfile = "driving" | "walking" | "cycling";

export type RoutingInputPoint = {
  lat: number;
  lng: number;
};

export type RoutingResult = {
  geometry: GeoJSON.LineString;
  distanceMeters: number;
  durationSeconds: number;
  raw?: unknown;
};

export async function calculateRoute(
  points: RoutingInputPoint[],
  profile: RoutingProfile = "driving"
): Promise<RoutingResult> {
  // 第一版使用 OSRM
}
```

OSRM 查询示例：

```txt
https://router.project-osrm.org/route/v1/driving/139.6917,35.6895;135.5023,34.6937?overview=full&geometries=geojson
```

注意：

- OSRM 坐标顺序是 `lng,lat`，不是 `lat,lng`。
- Leaflet marker 常用 `[lat, lng]`。
- 内部类型中要统一经纬度命名，避免坐标顺序错误。

### 8.3 storage.ts

职责：localStorage 保存和读取。

```ts
const STORAGE_KEY = "web-trip-map-planner:trip";

export function saveTripToLocal(trip: TripPlan): void {}

export function loadTripFromLocal(): TripPlan | null {}

export function exportTripJson(trip: TripPlan): string {}

export function importTripJson(json: string): TripPlan {}
```

---

## 9. UI 设计草案

### 9.1 主布局

```txt
┌──────────────────────────────────────────┬──────────────────────────┐
│                                          │ Search                   │
│                                          │ [ Tokyo Tower       🔍 ]  │
│                                          │                          │
│                                          │ Trip Stops               │
│                MapCanvas                 │ 1. Tokyo                 │
│                                          │ 2. Kyoto                 │
│                                          │ 3. Osaka                 │
│                                          │                          │
│                                          │ Route                    │
│                                          │ Distance: 520 km         │
│                                          │ Duration: 6h 20m         │
│                                          │                          │
│                                          │ [Calculate Route]        │
│                                          │ [Clear Route]            │
│                                          │ [Export JSON]            │
└──────────────────────────────────────────┴──────────────────────────┘
```

### 9.2 右侧面板功能区

右侧面板建议分成：

1. 搜索区
   - 搜索输入框。
   - 候选结果列表。

2. 行程点区
   - 已添加地点列表。
   - 删除按钮。
   - 选中按钮。
   - 后续支持拖拽排序。

3. 路线区
   - 路线模式选择。
   - 计算路线按钮。
   - 清除路线按钮。
   - 距离 / 时间展示。

4. 数据区
   - 保存到本地。
   - 导出 JSON。
   - 导入 JSON。

---

## 10. 地图交互规则

### 10.1 点击地图添加自定义点

第一版规则：

- 用户点击地图空白处。
- 弹出确认或直接添加自定义点。
- 默认名称：`Custom Stop 1`、`Custom Stop 2`。
- 添加后出现在右侧行程列表。

### 10.2 搜索结果添加地点

规则：

- 搜索结果点击后先定位地图。
- 提供 `Add to Trip` 按钮。
- 添加后生成 TripStop。

### 10.3 行程点选中

规则：

- 点击右侧 TripStopItem。
- 地图 flyTo 对应坐标。
- Marker 高亮。
- selectedStopId 更新。

### 10.4 路线计算

规则：

- 行程点数量少于 2 时禁用按钮。
- 调用 routing service 前清除旧路线或覆盖旧路线。
- 路线返回后绘制 RouteLayer。
- 如果用户调整行程点顺序，应提示路线已过期，或自动重新计算。

---

## 11. 第一阶段开发任务拆分

### Task 1：初始化项目

目标：建立 Vite + React + TypeScript 项目。

需要安装：

```bash
npm create vite@latest web-trip-map-planner -- --template react-ts
cd web-trip-map-planner
npm install
npm install leaflet react-leaflet zustand
npm install -D @types/leaflet
```

如加入绘制工具：

```bash
npm install @geoman-io/leaflet-geoman-free
```

### Task 2：实现基础布局

文件：

```txt
src/components/layout/AppLayout.tsx
src/components/layout/MapPanel.tsx
src/components/layout/SidePanel.tsx
src/styles/layout.css
```

目标：

- 全屏应用。
- 左侧地图区域自适应。
- 右侧固定宽度面板，例如 360px。

### Task 3：实现 MapCanvas

文件：

```txt
src/components/map/MapCanvas.tsx
```

目标：

- 使用 React Leaflet 显示地图。
- 默认中心点可以设为东京：`[35.681236, 139.767125]`。
- 默认 zoom：`6` 或 `10`。
- 加载 OSM tile layer。

### Task 4：实现 TripStore

文件：

```txt
src/store/tripStore.ts
src/types/trip.ts
```

目标：

- 创建默认 TripPlan。
- 实现 addStop / removeStop / selectStop。
- 实现 setRoute / clearRoutes。
- 实现 localStorage 保存和读取。

### Task 5：实现搜索功能

文件：

```txt
src/services/geocoding.ts
src/components/trip/SearchBox.tsx
src/components/trip/SearchResults.tsx
```

目标：

- 输入关键词。
- debounce 请求。
- 显示候选结果。
- 点击结果后添加到 trip stops。

### Task 6：显示 Marker

文件：

```txt
src/components/map/TripMarkers.tsx
```

目标：

- 从 tripStore 读取 stops。
- 在地图显示 Marker。
- Popup 显示 name / address。
- 点击 Marker 时更新 selectedStopId。

### Task 7：实现行程点列表

文件：

```txt
src/components/trip/TripStopList.tsx
src/components/trip/TripStopItem.tsx
```

目标：

- 右侧显示 stops。
- 支持选中。
- 支持删除。
- 后续再加拖拽排序。

### Task 8：实现路线规划

文件：

```txt
src/services/routing.ts
src/components/map/RouteLayer.tsx
src/components/trip/RouteSummary.tsx
```

目标：

- 行程点数量 >= 2 时启用计算路线。
- 使用 OSRM 获取 GeoJSON route。
- 在地图上绘制 Polyline。
- 右侧显示 distance / duration。

### Task 9：实现导入导出

文件：

```txt
src/services/storage.ts
src/components/trip/TripActions.tsx
```

目标：

- 保存到 localStorage。
- 从 localStorage 恢复。
- 导出 JSON 文件。
- 导入 JSON 文件。

### Task 10：加入绘制工具

文件：

```txt
src/components/map/DrawingLayer.tsx
```

目标：

- 集成 Leaflet-Geoman。
- 支持画线和区域。
- 支持编辑和删除。
- 将绘制结果保存为 GeoJSON。

---

## 12. 坐标和 GeoJSON 注意事项

### 12.1 Leaflet 坐标顺序

Leaflet 常用：

```ts
[lat, lng]
```

### 12.2 GeoJSON 坐标顺序

GeoJSON 标准使用：

```ts
[lng, lat]
```

### 12.3 OSRM 坐标顺序

OSRM URL 中使用：

```txt
lng,lat
```

因此要在工具函数中明确转换：

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

## 13. 格式化工具

建议实现：

```ts
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}
```

---

## 14. 第一版验收标准

完成后应满足：

1. 打开浏览器后能看到地图。
2. 可以搜索地点。
3. 可以把搜索结果加入行程。
4. 可以点击地图添加自定义地点。
5. 右侧能显示行程点列表。
6. 地图上能显示所有行程点 marker。
7. 至少两个地点时可以计算路线。
8. 地图上能显示路线线条。
9. 右侧能显示距离和时间。
10. 可以保存到 localStorage。
11. 刷新页面后可以恢复行程。
12. 可以导出 JSON。
13. 可以导入 JSON。

---

## 15. Codex 首轮实现指令建议

可以把下面这段作为给 Codex 的第一轮任务：

```txt
请基于当前规划创建一个 Vite + React + TypeScript 项目，实现 Web Trip Map Planner 的第一版 MVP。

优先完成：
1. 基础布局：左侧地图，右侧功能面板。
2. Leaflet 地图显示，使用 OpenStreetMap tile layer。
3. Zustand tripStore，支持添加、删除、选中行程点。
4. 搜索框，调用 Nominatim 搜索地点。
5. 搜索结果可以添加为 TripStop。
6. 地图显示 TripStop markers。
7. 右侧显示 TripStop 列表。
8. 至少两个地点时，调用 OSRM 计算路线。
9. 地图显示路线 polyline。
10. 右侧显示路线距离和耗时。
11. 支持 localStorage 保存和恢复。

请保持代码结构清晰，按 components/services/store/types/utils 拆分文件。
所有核心数据结构使用 TypeScript 类型定义。
注意 Leaflet 使用 [lat, lng]，GeoJSON 和 OSRM 使用 [lng, lat] 或 lng,lat。
```

---

## 16. 风险和注意事项

1. 公共 Nominatim 和 OSRM 服务只适合开发测试。
2. 地图 tile 也不应长期重度使用 OpenStreetMap 官方公共瓦片服务。
3. 路线规划和地理搜索应通过 service 层封装，方便后续替换 provider。
4. 坐标顺序是最容易出错的地方，需要单独写 utils。
5. MVP 阶段不要过早引入复杂权限、账号、云同步。
6. 如果后续需要更现代的地图样式，可以考虑迁移到 MapLibre GL JS。
7. 如果后续要做专业 GIS 功能，可以考虑 OpenLayers。

---

## 17. 建议的开发优先级

优先级从高到低：

1. 地图能显示。
2. 搜索能返回结果。
3. 地点能加入行程。
4. 地点能在地图上显示。
5. 路线能计算和显示。
6. 行程能保存恢复。
7. 绘制工具。
8. 多日行程。
9. 云端同步。
10. 自建地图服务。

第一版只要做到第 6 项，就已经形成完整可用闭环。
