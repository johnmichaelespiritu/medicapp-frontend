import { defineComponent } from "vue";

/**
 * EssentialLink Component
 *
 * A reusable Vue component for rendering essential links with icons and captions.
 *
 * @component
 * @name EssentialLink
 *
 * @props {String} title - The title of the link (required).
 * @props {String} caption - The caption of the link (optional, default: "").
 * @props {String} link - The URL or path the link should navigate to (optional, default: "#").
 * @props {String} icon - The name of the Quasar icon to display (optional, default: "").
 */
export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },
  },
});
