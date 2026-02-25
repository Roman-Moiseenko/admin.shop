<script lang="ts" setup>
import type { Form, ButtonProps } from "#ui/types";
import type { AuthProviders } from "~";
//import * as z from 'zod'

const config = useRuntimeConfig();
const router = useRouter();
const auth = useAuthStore();
const form = useTemplateRef<Form<any>>('form');
const toast = useToast();

const state = reactive({
  email: "",
  password: "",
  remember: false,
});

const { refresh: onSubmit, status: loginStatus } = useHttp<any>("auth/login", {
  method: "POST",
  body: state,
  immediate: false,
  watch: false,
  async onFetchResponse({ response }) {
    if (response?.status === 422) {
      form.value.setErrors(response._data?.errors);
    } else if (response._data?.ok) {
      await auth.login(response._data.token ?? null);
      await router.push("/");
    }
  }
});

const providers = ref<AuthProviders>(config.public.providers);

async function handleMessage(event: { data: any }): Promise<void> {
  const provider = event.data.provider as string;

  if (Object.keys(providers.value).includes(provider)) {
    providers.value[provider].loading = false;

    await auth.login(event.data.token ?? null);
    await router.push("/");
  } else if (event.data.message) {
    toast.add({
      icon: "i-heroicons-exclamation-circle-solid",
      color: "error",
      title: event.data.message,
    });
  }
}

function loginVia(provider: string): void {
  providers.value[provider].loading = true;

  const width = 640;
  const height = 660;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  const popup = window.open(
      `${config.public.apiBase}${config.public.apiPrefix}/login/${provider}/redirect`,
      "Sign In",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scollbars=no, resizable=no, copyhistory=no, width=${width},height=${height},top=${top},left=${left}`
  );

  const interval = setInterval(() => {
    if (!popup || popup.closed) {
      clearInterval(interval);
      providers.value[provider].loading = false;
    }
  }, 500);
}

onMounted(() => window.addEventListener("message", handleMessage));
onBeforeUnmount(() => window.removeEventListener("message", handleMessage));
const show = ref(false)
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-4">
      <UButton
          v-for="(provider, key) in providers"
          :key="key"
          :loading="provider.loading"
          :icon="provider.icon"
          :color="provider.color as ButtonProps['color']"
          :variant="provider.variant as ButtonProps['variant']"
          :label="provider.name"
          size="lg"
          class="w-full flex items-center justify-center"
          @click="loginVia(key as string)"
      />
    </div>

    <USeparator label="OR" />

    <UForm ref="form" :state="state" @submit="onSubmit" class="space-y-4">
      <UFormField label="Email" name="email" required>
        <UInput
            v-model="state.email"
            class="w-full"
            placeholder="you@example.com"
            icon="i-heroicons-envelope"
            trailing
            type="email"
            autofocus
        />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput
            v-model="state.password"
            class="w-full"
            placeholder="••••••••"
            :type="show ? 'text' : 'password'"
        >
          <template #trailing>
            <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show" />

          </template>

        </UInput>
      </UFormField>

      <UTooltip :delay-duration="0" text="for 1 month" :content="{ side: 'right', align: 'center' }">
        <div class="inline-flex">
          <UCheckbox v-model="state.remember" label="Remember me" class="inline-flex" />
        </div>
      </UTooltip>

      <div class="flex items-center justify-end space-x-4">

        <UButton type="submit" size="xl" label="Login" class="w-full" :loading="loginStatus === 'pending'" />
      </div>
    </UForm>


  </div>
</template>
