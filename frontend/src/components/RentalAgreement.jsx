import {
  useCreateRentalAgreementMutation,
  useGetRentalAgreementByBookingQuery,
} from '../redux/api/rentalAgreementApiSlice';
import { toast } from 'react-toastify';
import { FaFilePdf } from 'react-icons/fa';

const RentalAgreement = ({ bookingId }) => {
  const [createAgreement, { isLoading: isCreating }] = useCreateRentalAgreementMutation();
  const {
    data: agreement,
    isLoading: isLoadingAgreement,
    refetch,
  } = useGetRentalAgreementByBookingQuery(bookingId, {
    skip: !bookingId,
  });

  const handleCreateAgreement = async () => {
    try {
      await createAgreement({ bookingId }).unwrap();
      toast.success('Rental agreement created successfully');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.message || 'Failed to create rental agreement');
    }
  };

  const handleViewAgreement = () => {
    if (agreement?.pdfUrl) {
      // Open the PDF in a new tab
      window.open(
        `${import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL}${
          agreement.pdfUrl
        }`,
        '_blank'
      );
    }
  };

  if (isLoadingAgreement) {
    return <div>Loading agreement...</div>;
  }

  return (
    <div className="mt-4">
      {agreement ? (
        <button
          onClick={handleViewAgreement}
          className="flex items-center justify-center bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition duration-300"
        >
          <FaFilePdf className="mr-2" /> View Rental Agreement
        </button>
      ) : (
        <button
          onClick={handleCreateAgreement}
          disabled={isCreating}
          className="flex items-center justify-center bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition duration-300 disabled:opacity-50"
        >
          {isCreating ? 'Creating...' : 'Generate Rental Agreement'}
        </button>
      )}
    </div>
  );
};

export default RentalAgreement;
