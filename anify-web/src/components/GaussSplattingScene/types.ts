/** 边界配置 */
export interface BoundaryConfig {
  floorY: number;             // 地板Y坐标
  points: BoundaryPoint[];    // 有序的边界点列表
  wallHeight: number;         // 墙高度
}

/** 边界点 */
export interface BoundaryPoint {
  id: string;
  x: number;  // X坐标
  z: number;  // Z坐标
}

export interface InteractableConfig {
  id: string;
  modelUrl: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  triggerDistance: number;
}

export interface InteractionCallbacks {
  onEnter?: (id: string) => void;
  onExit?: (id: string) => void;
  onInteract?: (id: string) => void;
}

export interface SceneConfig {
  interactables: InteractableConfig[];
  splatUrl: string;
  walls?: WallConfig;
}

/** 单面墙的配置 */
export interface Wall {
  end: [number, number];    // X, Z 坐标
  height?: number;          // 可选，覆盖默认高度
  id: string;
  start: [number, number];  // X, Z 坐标
}

/** 墙面碰撞配置 */
export interface WallConfig {
  defaultHeight: number;    // 默认墙高度
  floorY: number;           // 地板Y坐标
  walls: Wall[];
}

/** 交互类型 */
export type InteractionActionType = 'alert' | 'dialog' | 'scene-switch' | 'panel' | 'open-map';

/** 对话框内容 */
export interface DialogContent {
  title: string;
  contentType: 'text' | 'image';
  text?: string;      // contentType='text' 时使用
  imageUrl?: string;  // contentType='image' 时使用
}

/** 场景切换配置 */
export interface SceneSwitchConfig {
  splatUrl: string;              // .spz 文件 URL
  wallsConfigUrl: string;        // 墙面配置 JSON URL
  interactionPointsUrl: string;  // 交互点配置 JSON URL
  floorConfigUrl: string;        // 地板配置 JSON URL
}

/** 面板类型 */
export type PanelActionType = 'shop' | 'forge' | 'guild' | 'inn';

/** 地图配置 */
export interface MapActionConfig {
  canTravel?: boolean;  // 是否可传送，默认false
}

/** 交互行为（联合类型） */
export type InteractionAction =
  | { type: 'alert'; message?: string }
  | { type: 'dialog'; dialog: DialogContent }
  | { type: 'scene-switch'; scene: SceneSwitchConfig }
  | { type: 'panel'; panel: PanelActionType }
  | { type: 'open-map'; map?: MapActionConfig };

/** 交互点显示类型 */
export type InteractionPointDisplayType = 'default' | 'portrait' | 'navigation' | 'treasure';

/** 可交互点 */
export interface InteractionPoint {
  id: string;
  imageScale?: number;  // 可选图片缩放比例，默认1
  imageUrl?: string;  // 可选图片URL，用于显示立绘或图标（Billboard）
  label?: string;  // 可选标签，供未来使用
  position: [number, number, number];  // x, y, z 世界坐标
  triggerDistance?: number;  // 可选触发距离，默认1米
  action?: InteractionAction;  // 可选交互行为，默认为 alert
  displayType?: InteractionPointDisplayType;  // 显示样式
  icon?: string;  // emoji字符，用于 navigation/treasure 样式
}

/** 可交互点配置文件格式 */
export interface InteractionPointConfig {
  interactionPoints: InteractionPoint[];
}
