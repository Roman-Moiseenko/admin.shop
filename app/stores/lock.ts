import {defineStore} from 'pinia'

import {useHttp} from "~/composables/useHttp";

export type LockType = {
    id: number;
    entity: string;
    entity_id: string;
    user_id: number;
    locked_at: any;
    expires_at: any;
}
export type LockStatus = {
    locked: boolean;
    lockedBy: number;
    lockedAt: string;
    message: string;
}


export const useLockStore = defineStore('lock', () => {
    const HEARTBEAT_INTERVAL_SECONDS = 30;
    const user = useAuthStore().user
    const toast = useToast()

    // Состояние для текущей блокировки (каждый store будет иметь только одну активную блокировку)
    const currentLock = ref({
        locked: false,
        lockedBy: null, // User object or name string
        lockedAt: null,
        entity: null, // e.g., 'product', 'category'
        entity_id: null,
        errorMessage: null,
    });
    let heartbeatInterval = null; // Интервал для Heartbeat

    const fetchLockStatus = async (entity: string, entity_id: number): Promise<boolean> => {

        const {data, error, pending, execute} = await useHttp<LockStatus>(`/lock/status`, {
            method: "POST",
            body: {
                entity: entity,
                entity_id: entity_id
            },
            immediate: false,
            watch: false,
        });
        try {
            await execute();
            // Если useFetch вернул ошибку, обрабатываем ее
            if (error.value) {
                if (error.value.statusCode === 404) return false //404 - нет блокировки
                toast.add({
                    title: `Неизвестная ошибка при получении статуса блокировки`,
                    icon: 'i-heroicons-x-circle-solid',
                    color: 'error'
                });
            }
            if (!data.value) return false; //Нет данных - нет блокировки

            toast.add({
                title: `Данные заблокированы ${data.value.lockedBy} ${data.value.lockedAt}`,
                icon: 'i-heroicons-x-circle-solid',
                color: 'error'
            });

            // Возвращаем данные, которые могут быть null, если useFetch завершился без данных, но и без ошибки
            return data.value.locked;
        } catch (error) {
            console.error(`Error fetching lock status for ${entity} ${entity_id}:`, error);
            currentLock.value.errorMessage = `Ошибка при проверке блокировки: ${error.message}`;
            return false; // В случае ошибки считаем ресурс незаблокированным для нас
        }
    };

    const acquireLock = async (entity, entity_id) => {
        currentLock.value.errorMessage = null; // Сбрасываем ошибки
        const {data, error, status, execute} = await useHttp<LockStatus>(`/lock/set`, {
            method: 'POST',
            body: {
                entity: entity,
                entity_id: entity_id
            },
            immediate: false,
            watch: false,
        });
        try {
            await execute();

            if (error.value) {
                currentLock.value.errorMessage = data.value.message || `Не удалось заблокировать ${entity}.`;
                toast.add({
                    title: currentLock.value.errorMessage,
                    icon: 'i-heroicons-x-circle-solid',
                    color: 'error'
                });
                return false;
            }

            //Сервер не дал блокировку
            if (!data.value.locked) {
                currentLock.value = {
                    ...currentLock.value,
                    locked: true,
                    lockedBy: data.value.lockedBy || 'Неизвестный',
                    lockedAt: data.value.lockedAt || 'недавно',
                    entity: entity,
                    entity_id: entity_id,
                    errorMessage: data.value.message,
                };
                toast.add({
                    title: currentLock.value.errorMessage,
                    icon: 'i-heroicons-x-circle-solid',
                    color: 'error'
                });
                return false;
            }
            // Успешно заблокировано или блокировка обновлена
            currentLock.value = {
                locked: true,
                lockedBy: user.name, // Имя текущего пользователя
                lockedAt: data.value.lockedAt || 'только что', // API может вернуть updated lockedAt
                entity: entity,
                entity_id: entity_id,
                errorMessage: null,
            };
            return true;
        } catch (e) {
            currentLock.value.errorMessage = `Ошибка связи с сервером при блокировке: ${e.message}`;
            toast.add({
                title: currentLock.value.errorMessage,
                icon: 'i-heroicons-x-circle-solid',
                color: 'error'
            });
            return false;
        }
    };

    const releaseLock = async () => {
        //console.log()
        if (!currentLock.value.locked || currentLock.value.lockedBy !== user.name) {
            // Блокировки нет или она не наша - ничего не делаем
            return;
        }
        const {entity, entity_id} = currentLock.value;
        try {
            await useHttp<any>('/lock/remove', {
                method: 'POST',
                body: {
                    entity: entity,
                    entity_id: entity_id,
                }
            })

        } catch (error) {
            toast.add({
                title: `Ошибка сброса блокировки ${entity} ${entity_id}`,
                icon: 'i-heroicons-x-circle-solid',
                color: 'error'
            });
        } finally {
            stopHeartbeat(); // Обязательно останавливаем heartbeat
            currentLock.value = { // Сбрасываем состояние блокировки
                locked: false,
                entity: null,
                entity_id: null,
                lockedBy: null,
                lockedAt: null,
                errorMessage: null,
            };
        }
    };

    const sendHeartbeat = async () => {
        if (!currentLock.value.locked || !currentLock.value.entity || !currentLock.value.entity_id) {
            stopHeartbeat(); // Если вдруг блокировка потеряна, останавливаем Heartbeat
            return;
        }
        const success = await acquireLock(currentLock.value.entity, currentLock.value.entity_id);
        if (!success && currentLock.value.lockedBy !== user.name) {
            // Если Heartbeat не прошел, и ресурс теперь заблокирован кем-то другим,
            // или блокировка просто пропала (просрочилась), выдаем предупреждение
            stopHeartbeat();
            toast.add({
                title: 'Ваша сессия редактирования истекла или была прервана.',
                icon: 'i-heroicons-x-circle-solid',
                color: 'error'
            });
            // Можно также перенаправить или заблокировать форму
        }
    };

    const startHeartbeat = () => {
        stopHeartbeat(); // Сначала очищаем, если уже был запущен
        heartbeatInterval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_SECONDS * 1000);
    };

    const stopHeartbeat = () => {
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
        }
    };
    return {
        currentLock,
        fetchLockStatus,
        acquireLock,
        releaseLock,
        startHeartbeat,
        stopHeartbeat,
      //  HEARTBEAT_INTERVAL_SECONDS, // Можно экспортировать для информации
    };
})