// components/ui/pagination.tsx
import { Button } from "@/components/ui/button"

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </Button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next
      </Button>
    </div>
  )
}
