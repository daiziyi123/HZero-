/**
 * 设备点位名称配置
 * 按页面/设备类型区分，所有点位集中在当前页面维护
 */

interface PointConfig {
    [key: string]: string;
}

interface StatusConfig {
    robot: PointConfig;
    cylinder: PointConfig;
    servoMotor: PointConfig;
}

const statusConfig: StatusConfig = {
    // ========== 机器人综合健康总览  --- 页面点位 ==========
    robot: {
        /** 状态点位 */
        state: 'state',
        /** 报警点位 */
        alarm: 'alarm',
    },
    // ========== 气缸综合健康总览   ---- 页面点位 ==========
    cylinder: {
        /** 气缸状态点位 */
        cylinder: 'cylinder',
    },
    // ========== 伺服电机详情    ----- 页面点位 ==========
    servoMotor: {
        /** 伺服ON */
        servoOn: 'servoOn',
        /** 运行 */
        running: 'running',
        /** 运行就绪 */
        runReady: 'runReady',
        /** 输出级使能 */
        outputStageEnable: 'outputStageEnable',
        /** 制动器 */
        brake: 'brake',
        /** 故障 */
        fault: 'fault',
        /** 速度 */
        speed: 'speed',
        /** 位置 */
        position: 'position',
        /** 转矩 */
        torque: 'torque',
    },
};

export type { PointConfig, StatusConfig };
export default statusConfig;
