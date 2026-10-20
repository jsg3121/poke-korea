import FilterModalForm from './FilterModalForm.component'

interface FilterModalProps {
  open: boolean
  onClose: () => void
}

const FilterModal = ({ open, onClose }: FilterModalProps) => {
  if (!open) return null

  return <FilterModalForm onClose={onClose} />
}

export default FilterModal
