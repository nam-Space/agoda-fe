import { useState } from 'react';
import { CreditCard, Lock, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const CreditCardForm = ({ onCardValidated }) => {
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardInfo(prev => ({
        ...prev,
        cardNumber: formatCardNumber(value)
      }));
    }
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCardInfo(prev => ({
        ...prev,
        expiryDate: formatExpiryDate(value)
      }));
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCardInfo(prev => ({ ...prev, cvv: value }));
    }
  };

  const handleCardNameChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z\s]*$/.test(value)) {
      setCardInfo(prev => ({ ...prev, cardName: value }));
    }
  };

  const validateCard = () => {
    if (!cardInfo.cardNumber || cardInfo.cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Số thẻ không hợp lệ');
      return false;
    }
    if (!cardInfo.cardName || cardInfo.cardName.length < 3) {
      toast.error('Tên chủ thẻ không hợp lệ');
      return false;
    }
    if (!cardInfo.expiryDate || cardInfo.expiryDate.length !== 5) {
      toast.error('Ngày hết hạn không hợp lệ');
      return false;
    }
    if (!cardInfo.cvv || cardInfo.cvv.length !== 3) {
      toast.error('CVV không hợp lệ');
      return false;
    }
    return true;
  };

  const handleVerifyCard = async () => {
    if (!validateCard()) return;

    setIsVerifying(true);

    // Mock verification - simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast.success('Thẻ đã được xác thực thành công!');
      onCardValidated && onCardValidated(cardInfo);
    }, 2000);
  };

  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    return 'Card';
  };

  return (
    <div className="space-y-4">
      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Số thẻ <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={cardInfo.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
            disabled={isVerified}
          />
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          {cardInfo.cardNumber && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-blue-600">
              {getCardType(cardInfo.cardNumber)}
            </span>
          )}
        </div>
      </div>

      {/* Card Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên chủ thẻ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={cardInfo.cardName}
          onChange={handleCardNameChange}
          placeholder="NGUYEN VAN A"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
          disabled={isVerified}
        />
      </div>

      {/* Expiry & CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày hết hạn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={cardInfo.expiryDate}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isVerified}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="password"
              value={cardInfo.cvv}
              onChange={handleCvvChange}
              placeholder="123"
              maxLength={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isVerified}
            />
            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Verify Button */}
      {!isVerified && (
        <button
          onClick={handleVerifyCard}
          disabled={isVerifying}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            isVerifying
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isVerifying ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang xác thực...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Xác thực thẻ</span>
            </>
          )}
        </button>
      )}

      {/* Verified Badge */}
      {isVerified && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">Thẻ đã được xác thực</p>
            <p className="text-xs text-green-600">
              **** **** **** {cardInfo.cardNumber.slice(-4)}
            </p>
          </div>
        </div>
      )}

      {/* Security Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Thanh toán an toàn và bảo mật</p>
            <p className="text-xs text-blue-600">
              Thông tin thẻ của bạn được mã hóa SSL 256-bit và không được lưu trữ trên hệ thống
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
