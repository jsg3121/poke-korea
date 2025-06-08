import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopDetailSidebarBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return (
    <div
      ref={slotRef}
      className="max-w-40 max-h-fit absolute -right-[200px] xl:static xl:right-0 max-xl:w-0 max-xl:hidden"
    >
      <ins
        className="adsbygoogle w-40 max-h-[600px] block"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="9075172521"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}

export default DesktopDetailSidebarBanner
