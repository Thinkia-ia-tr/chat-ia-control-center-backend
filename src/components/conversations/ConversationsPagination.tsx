
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ConversationsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ConversationsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ConversationsPaginationProps) {
  // Generate array of page numbers to show
  const getPageNumbers = () => {
    // Always show first page, last page, current page, and 1 page before and after current
    const pageNumbers: number[] = [];
    
    // Always add page 1
    pageNumbers.push(1);
    
    // Add ellipsis indicator if needed
    if (currentPage > 3) {
      pageNumbers.push(-1); // -1 will be rendered as ellipsis
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis indicator if needed
    if (currentPage < totalPages - 2) {
      pageNumbers.push(-2); // -2 will be rendered as ellipsis (different key from the first ellipsis)
    }
    
    // Add last page if we have more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <Pagination className="ml-auto scale-90 transform-origin-right">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>

        {getPageNumbers().map((pageNumber, i) => {
          // Render ellipsis
          if (pageNumber < 0) {
            return (
              <PaginationItem key={`ellipsis-${pageNumber}`}>
                <span className="px-4 py-2">...</span>
              </PaginationItem>
            );
          }
          
          // Render page number
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber)}
                className={pageNumber === currentPage ? "" : "cursor-pointer"}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default ConversationsPagination;
