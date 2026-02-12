<script setup lang="ts">
import Avatar from '@/components/ui/Avatar.vue'
import Button from '@/components/ui/Button.vue'
import StatusIndicator from '@/components/ui/StatusIndicator.vue'
import { IconArrow } from '@/assets/icons'
import { useChatsStore } from '@/stores'
import type { Chat } from '@/types'

defineProps<{
  contact: Chat
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { isOnline } = useChatsStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="sidebar-backdrop">
      <div
        v-show="isOpen"
        class="contact-sidebar-backdrop"
        aria-hidden="true"
        @click="emit('close')"
      />
    </Transition>
    <Transition name="sidebar-panel">
      <aside
        v-show="isOpen"
        class="contact-sidebar"
        role="dialog"
        aria-label="Contact info"
      >
        <div class="contact-sidebar__inner">
          <div class="contact-sidebar__header">
            <Button
              size="icon"
              class="contact-sidebar__back"
              aria-label="Close"
              @click="emit('close')"
            >
              <IconArrow />
            </Button>
            <Avatar :name="contact.name" size="md" />
            <span class="contact-sidebar__name">{{ contact.name }}</span>
            <StatusIndicator :online="isOnline(contact.id)" show-label />
          </div>
          <dl class="contact-sidebar__details">
            <dt class="contact-sidebar__term">Имя пользователя</dt>
            <dd class="contact-sidebar__value">{{ contact.username }}</dd>
            <dt class="contact-sidebar__term">Почта:</dt>
            <dd class="contact-sidebar__value">
              <a :href="`mailto:${contact.email}`" class="contact-sidebar__link">{{ contact.email }}</a>
            </dd>
            <dt class="contact-sidebar__term">Телефон:</dt>
            <dd class="contact-sidebar__value">
              <a :href="`tel:${contact.phone}`" class="contact-sidebar__link">{{ contact.phone }}</a>
            </dd>
            <dt class="contact-sidebar__term">Веб-сайт:</dt>
            <dd class="contact-sidebar__value">
              <a :href="`https://${contact.website}`" target="_blank" rel="noopener noreferrer" class="contact-sidebar__link">{{ contact.website }}</a>
            </dd>
            <dt class="contact-sidebar__term">Адрес:</dt>
            <dd class="contact-sidebar__value">
              {{ contact.address.street }}, {{ contact.address.suite }}<br>
              {{ contact.address.city }}, {{ contact.address.zipcode }}
            </dd>
            <dt class="contact-sidebar__term">Компания:</dt>
            <dd class="contact-sidebar__value">
              <strong>{{ contact.company.name }}</strong><br>
              <span class="contact-sidebar__muted">{{ contact.company.catchPhrase }}</span>
            </dd>
          </dl>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins.scss' as *;

.contact-sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  will-change: opacity;
}

.contact-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(320px, 90vw);
  background: var(--bg-panel);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  will-change: transform;
  overflow-x: hidden;
  overflow-y: auto;
}

.contact-sidebar__inner {
  padding: 24px;
  min-width: 0;
}

.contact-sidebar__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
}

.contact-sidebar__back {
  position: absolute;
  left: 0;
  top: 0;
}

.contact-sidebar__name {
  font-weight: 600;
  font-size: 18px;
  color: var(--text-primary);
  @include singleLineEllipsis;
  max-width: 100%;
}

.contact-sidebar__details {
  margin: 24px 0 0;
  display: grid;
  gap: 8px 16px;
}

.contact-sidebar__term {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  @include singleLineEllipsis;
  min-width: 0;
}

.contact-sidebar__value {
  margin: 0;
  font-size: 15px;
  color: var(--text-primary);
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-word;
}

.contact-sidebar__link {
  display: block;
  color: var(--accent, #2563eb);
  text-decoration: none;
  @include singleLineEllipsis;

  &:hover {
    text-decoration: underline;
  }
}

.contact-sidebar__value strong {
  display: block;
  @include singleLineEllipsis;
}

.contact-sidebar__muted {
  display: block;
  font-size: 13px;
  color: var(--text-muted);
  @include singleLineEllipsis;
}

.sidebar-backdrop-enter-active,
.sidebar-backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.sidebar-backdrop-enter-from,
.sidebar-backdrop-leave-to {
  opacity: 0;
}

.sidebar-panel-enter-active,
.sidebar-panel-leave-active {
  transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}
.sidebar-panel-enter-from,
.sidebar-panel-leave-to {
  transform: translateX(100%);
}
</style>
