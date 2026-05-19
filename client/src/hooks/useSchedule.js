import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchData, saveData } from '../services/api';

export const useSchedule = () => {
  const [granularity, setGranularity] = useState(60);
  const [commonTasks, setCommonTasks] = useState([]);
  const [tempTasks, setTempTasks] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 从服务器加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchData();
        setCommonTasks(data.commonTasks || []);
        setTempTasks(data.tempTasks || []);
        setSchedule(data.schedule || {});
        setGranularity(data.granularity || 60);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 保存数据到服务器
  const persistData = useCallback(async () => {
    try {
      await saveData({
        commonTasks,
        tempTasks,
        schedule,
        granularity,
      });
    } catch (err) {
      setError(err.message);
    }
  }, [commonTasks, tempTasks, schedule, granularity]);

  // 数据变化时自动保存
  useEffect(() => {
    if (!loading) {
      persistData();
    }
  }, [commonTasks, tempTasks, schedule, granularity, loading, persistData]);

  // 添加常用任务
  const addCommonTask = useCallback((task) => {
    setCommonTasks(prev => [...prev, task]);
  }, []);

  // 删除常用任务
  const deleteCommonTask = useCallback((taskId) => {
    setCommonTasks(prev => prev.filter(t => t.id !== taskId));
    // 同时从日程中移除
    setSchedule(prev => {
      const newSchedule = { ...prev };
      Object.keys(newSchedule).forEach(key => {
        if (newSchedule[key] === taskId) {
          delete newSchedule[key];
        }
      });
      return newSchedule;
    });
  }, []);

  // 添加临时任务
  const addTempTask = useCallback((task) => {
    setTempTasks(prev => [...prev, task]);
  }, []);

  // 删除临时任务
  const deleteTempTask = useCallback((taskId) => {
    setTempTasks(prev => prev.filter(t => t.id !== taskId));
    // 同时从日程中移除
    setSchedule(prev => {
      const newSchedule = { ...prev };
      Object.keys(newSchedule).forEach(key => {
        if (newSchedule[key] === taskId) {
          delete newSchedule[key];
        }
      });
      return newSchedule;
    });
  }, []);

  // 添加任务到时间块
  const addTaskToSlot = useCallback((slotId, taskId) => {
    setSchedule(prev => ({
      ...prev,
      [slotId]: taskId
    }));
  }, []);

  // 从时间块移除任务
  const removeTaskFromSlot = useCallback((slotId) => {
    const taskId = schedule[slotId];
    setSchedule(prev => {
      const newSchedule = { ...prev };
      delete newSchedule[slotId];
      return newSchedule;
    });
    // 如果是临时任务，同时删除该任务
    const task = getTaskById(taskId);
    if (task && !task.isCommon) {
      setTempTasks(prev => prev.filter(t => t.id !== taskId));
    }
  }, [schedule]);

  // 获取所有任务
  const allTasks = useMemo(() => [...commonTasks, ...tempTasks], [commonTasks, tempTasks]);

  // 获取任务 by ID
  const getTaskById = useCallback((taskId) => {
    return allTasks.find(t => t.id === taskId);
  }, [allTasks]);

  // 获取未安排的临时任务
  const unscheduledTempTasks = useMemo(() => 
    tempTasks.filter(task => !Object.values(schedule).includes(task.id)),
    [tempTasks, schedule]
  );

  return {
    granularity,
    setGranularity,
    commonTasks,
    tempTasks,
    schedule,
    allTasks,
    unscheduledTempTasks,
    loading,
    error,
    addCommonTask,
    deleteCommonTask,
    addTempTask,
    deleteTempTask,
    addTaskToSlot,
    removeTaskFromSlot,
    getTaskById,
  };
};
