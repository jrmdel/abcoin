import { ICoinListingChangeReport } from 'src/coin-history/coin-history.interface';
import { formatPrice, formatReportMessage, formatThresholdMessage } from 'src/functions/formatter/formatter.tools';
import { thresholdReachedFixture } from 'test/fixtures/threshold.fixtures';

describe('formatter tools', () => {
  describe('formatReportMessage', () => {
    it('should return null for empty listings', () => {
      expect(formatReportMessage([])).toBeNull();
    });

    it('should format two elements correctly', () => {
      const listings: ICoinListingChangeReport[] = [
        {
          symbol: 'BTC',
          price: 45000.1234,
          percentChange24h: 2.5,
          percentChange7d: 3.1,
        },
        {
          symbol: 'USDT',
          price: 0.995678,
          percentChange24h: -0.1,
          percentChange7d: -0.052,
        },
      ];

      const result = formatReportMessage(listings);

      expect(result).toEqual(
        `📊 **Crypto Report** 📊\n\n**🪙 BTC** - $45 000\n- 24h Change: 2.50% 🟢\n- 7d Change: 3.10% 🟢\n\n**🪙 USDT** - $0.996\n- 24h Change: -0.10% 🔴\n- 7d Change: -0.05% 🔴\n`,
      );
    });
  });

  describe('formatThresholdMessage', () => {
    it('should format a single element correctly', () => {
      const result = formatThresholdMessage([thresholdReachedFixture[0]]);

      expect(result).toBe('🎢 New threshold reached\n\n**BTC**: $60 000 📈');
    });

    it('should format multiple elements correctly', () => {
      const result = formatThresholdMessage(thresholdReachedFixture);

      expect(result).toBe('🎢 New thresholds reached\n\n**BTC**: $60 000 📈\n**ETH**: $1 000 📉\n**ETH**: $1 500 📉');
    });

    it('should return null when no threshold have been reached', () => {
      expect(formatThresholdMessage([])).toBeNull();
    });
  });

  describe('formatPrice', () => {
    it('should format large prices with space as thousand separator', () => {
      expect(formatPrice(1234567.89)).toBe('1 234 568');
    });

    it('should format prices greater than 10 with two decimal places', () => {
      expect(formatPrice(45.6789)).toBe('45.68');
    });

    it('should format prices between 0 and 10 with three decimal places', () => {
      expect(formatPrice(0.98765)).toBe('0.988');
    });

    it('should format very small prices in exponential notation', () => {
      expect(formatPrice(0.000123456)).toBe('1.2346e-4');
    });

    it('should format prices between 0.001 and 0.01 with four decimal places', () => {
      expect(formatPrice(0.005678)).toBe('0.0057');
    });
  });
});
