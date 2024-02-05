export const caseStatus = (status) => {
  switch (status) {
    case 'pending':
      return (
        <div className="font-semibold text-xl capitalize text-amber-500 ">
          pending
        </div>
      );
    case 'paid':
      return (
        <div className="font-semibold text-xl capitalize text-green-500 ">
          Paid
        </div>
      );
    case 'rejected':
      return (
        <div className="font-semibold text-xl capitalize text-red-500 ">
          rejected
        </div>
      );
    case 'checking':
      return (
        <div className="font-semibold text-xl capitalize text-amber-500 ">
          checking
        </div>
      );
    case 'refunded':
      return (
        <div className="font-semibold text-xl capitalize text-red-500 ">
          refunded
        </div>
      );
    default:
      break;
  }
};
