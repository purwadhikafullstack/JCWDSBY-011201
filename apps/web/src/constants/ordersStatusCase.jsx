export const caseStatus = (status) => {
  switch (status) {
    case 'pending':
      return (
        <div className="font-semibold text-sm lg:text-lg capitalize text-amber-500 ">
          pending
        </div>
      );
    case 'paid':
      return (
        <div className="font-semibold  text-sm lg:text-lg capitalize text-green-500 ">
          Paid
        </div>
      );
    case 'rejected':
      return (
        <div className="font-semibold  text-sm lg:text-lg capitalize text-red-500 ">
          rejected
        </div>
      );
    case 'checking':
      return (
        <div className="font-semibold  text-sm lg:text-lg capitalize text-amber-500 ">
          checking
        </div>
      );
    case 'refunded':
      return (
        <div className="font-semibold  text-sm lg:text-lg capitalize text-red-500 ">
          refunded
        </div>
      );
    case 'sending':
      return (
        <div className="font-semibold text-sm lg:text-lg capitalize text-blue-400 ">
          sending
        </div>
      );
    case 'arrived':
      return (
        <div className="font-semibold text-sm lg:text-lg capitalize text-emerald-500 ">
          arrived
        </div>
      );
    case 'finished':
      return (
        <div className="font-semibold text-sm lg:text-lg capitalize text-green-500 ">
          finished
        </div>
      );
    case 'canceled':
      return (
        <div className="font-semibold  text-sm lg:text-lg capitalize text-red-600 ">
          canceled
        </div>
      );
    default:
      break;
  }
};
