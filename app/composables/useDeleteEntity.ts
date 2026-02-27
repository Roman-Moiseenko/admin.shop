import { computed } from 'vue';

let _instance: ReturnType<typeof _createDeleteEntityComposable> | null = null;
let _current_state: ReturnType<typeof useState<typeof initialDeleteEntityState>> | null = null;

const initialDeleteEntityState = {
    name: '', // Имя модального окна (для идентификации, если их несколько)
    resolve: null as ((value?: boolean | PromiseLike<boolean>) => void) | null,
    reject: null as ((reason?: any) => void) | null,
    route: '', // URL для отправки DELETE запроса
    soft: false, // Мягкое удаление или полное
    isLoading: false, // Состояние загрузки запроса
};
// Функция, которая создает и возвращает композицию.
// Она будет вызываться только один раз.
function _createDeleteEntityComposable() {
    // Теперь useState вызывается внутри функции, которая будет вызвана в правильном контексте Nuxt
    _current_state = useState('delete-entity-state', () => ({ ...initialDeleteEntityState }));
    const _current = _current_state.value; // Получаем реактивный объект из useState

    const toast = useToast();
    const isModalActive = computed(() => _current.name !== '');
    const isSoftDelete = computed(() => _current.soft);
    const operationIsLoading = computed(() => _current.isLoading);

    const show = async (route: string, { name = 'default-entity', soft = false } = {}): Promise<boolean> => {
        if (_current.name !== '') {
            _current.reject?.(new Error('Previous delete operation cancelled (new one started).'));
        }
        _current.name = name;
        _current.route = route;
        _current.soft = soft;
        _current.isLoading = false;
        return new Promise((resolve, reject) => {
            _current.resolve = resolve;
            _current.reject = reject;
        });
    };
    const accept = async () => {
        if (!_current.route) {
            console.error('Не указан route для удаления.');
            cancel();
            return;
        }
        _current.isLoading = true;
        toast.add({ title: 'Удаление...', icon: 'i-heroicons-arrow-path-solid', id: 'delete-loading' });
        try {
            await useHttp<any>(_current.route, {
                method: "DELETE",
            })
            toast.remove('delete-loading');
            toast.add({ title: 'Успешно удалено!', icon: 'i-heroicons-check-circle-solid', color: 'success' });
            if (_current.resolve !== null) _current.resolve()
        } catch (error) {

            toast.remove('delete-loading');
            toast.add({ title: 'Ошибка при удалении.', icon: 'i-heroicons-x-circle-solid', color: 'error' });
            if (_current.resolve !== null) _current.resolve()
        } finally {
            // Это сброс состояния должен быть через _current_state.value
            _current_state.value = { ...initialDeleteEntityState }; // Сброс состояния к начальному, чтобы очистить resolve/reject
            _current.name = '';
            _current.route = '';
        }
    };
    const cancel = () => {
        toast.remove('delete-loading');
        if (_current.reject !== null) _current.reject();

        _current_state.value = { ...initialDeleteEntityState, name: '', route: '' }; // Сброс состояния к начальному
        _current.name = '';
        _current.route = '';
    };
    return {
        showModal: show,
        accept,
        cancel,
        isModalActive,
        isSoftDelete,
        operationIsLoading,
        currentEntityName: computed(() => _current.name),
        currentRoute: computed(() => _current.route),
    };
}
// Экспортируемая функция, которая обеспечивает синглтон-доступ к композиции
export function useDeleteEntity() {
    if (!_instance) {
        _instance = _createDeleteEntityComposable();
    }
    return _instance;
}