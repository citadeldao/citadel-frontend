import { ref } from 'vue';

export default function useCurrentIcon(initialIcon) {
  const inputIcon = ref(initialIcon);
  const updateCurrentIcon = (icon) => {
    inputIcon.value = icon;
  };

  return {
    updateCurrentIcon,
    inputIcon,
  };
}
