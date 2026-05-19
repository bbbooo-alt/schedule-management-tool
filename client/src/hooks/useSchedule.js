import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchData,
  createTask,
  deleteTask,
  addToSchedule,
  removeFromSchedule,
  updateSetting
} from '../services/api';

export const useSchedule = () => {
  const [granularity, setGranularityState] = useState(60);
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
        setGranularityState(data.granularity || 60);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 设置粒度并保存到数据库
  const setGranularity = useCallback(async (value) => {
    try {
      setGranularityState(value);
      await updateSetting('granularity', value.toString());
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // 添加常用任务
  const addCommonTask = useCallback(async (task) => {
    try {
      const newTask = await createTask(task);
      setCommonTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // 删除常用任务
  const deleteCommonTask = useCallback(async (taskId) => {
    try {
      await deleteTask(taskId);
      setCommonTasks(prev => prev.filter(t => t.id !== taskId));
      // 日程会自动级联删除
      setSchedule(prev => {
        const newSchedule = { ...prev };
        Object.keys(newSchedule).forEach(key => {
          if (newSchedule[key] === taskId) {
            delete newSchedule[key];
          }
        });
        return newSchedule;
      });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // 添加临时任务
  const addTempTask = useCallback(async (task) => {
    try {
      const newTask = await createTask(task);
      setTempTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  // 删除临时任务
  const deleteTempTask = useCallback(async (taskId) => {
    try {
      await deleteTask(taskId);
      setTempTasks(prev => prev.filter(t => t.id !== taskId));
      // 日程会自动级联删除
      setSchedule(prev => {
        const newSchedule = { ...prev };
        Object.keys(newSchedule).forEach(key => {
          if (newSchedule[key] === taskId) {
            delete newSchedule[key];
          }
        });
        return newSchedule;
      });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // 添加任务到时间块
  const addTaskToSlot = useCallback(async (slotId, taskId) => {
    try {
      await addToSchedule(slotId, taskId);
      setSchedule(prev => ({
        ...prev,
        [slotId]: taskId
      }));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // 从时间块移除任务
  const removeTaskFromSlot = useCallback(async (slotId) => {
    try {
      const taskId = schedule[slotId];
      await removeFromSchedule(slotId);
      
      setSchedule(prev => {
        const newSchedule = { ...prev };
        delete newSchedule[slotId];
        return newSchedule;
      });
      
      // 如果是临时任务，同时删除该任务
      const task = getTaskById(taskId);
      if (task && !task.isCommon) {
        await deleteTask(taskId);
        setTempTasks(prev => prev.filter(t => t.id !== taskId));
      }
    } catch (err) {
      setError(err.message);
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

  // 刷新数据
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchData();
      setCommonTasks(data.commonTasks || []);
      setTempTasks(data.tempTasks || []);
      setSchedule(data.schedule || {});
      setGranularityState(data.granularity || 60);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
    refreshData,
  };
};
