export default function FaSolidGamepad(props: { class?: string }) {
  return (
    <svg
      fill="currentColor"
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      height="1em"
      width="1em"
      style="overflow: visible; color: currentcolor;"
      class={props.class}
    >
      <path d="M192 64C86 64 0 150 0 256s86 192 192 192h256c106 0 192-86 192-192S554 64 448 64H192zm304 104a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 304a40 40 0 1 1 80 0 40 40 0 1 1-80 0zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24v32h32c13.3 0 24 10.7 24 24s-10.7 24-24 24h-32v32c0 13.3-10.7 24-24 24s-24-10.7-24-24v-32h-32c-13.3 0-24-10.7-24-24s10.7-24 24-24h32v-32z"></path>
    </svg>
  )
}
