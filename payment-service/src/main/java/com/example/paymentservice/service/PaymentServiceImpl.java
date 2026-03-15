package com.example.paymentservice.service;

import com.example.paymentservice.client.OrderServiceClient;
import com.example.paymentservice.dto.PaymentRequest;
import com.example.paymentservice.dto.PaymentResponse;
import com.example.paymentservice.entity.Payment;
import com.example.paymentservice.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * PaymentServiceImpl - Placeholder implementation
 * Full implementation will be added during feature development
 */
@Service
public class PaymentServiceImpl implements PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired(required = false)
    private OrderServiceClient orderServiceClient;

    @Override
    public PaymentResponse processPayment(PaymentRequest request) {
        if (request == null || request.getOrderId() == null || request.getOrderId().isBlank()) {
            throw new IllegalArgumentException("orderId is required");
        }
        if (request.getAmount() == null || request.getAmount().signum() <= 0) {
            throw new IllegalArgumentException("amount must be greater than zero");
        }

        logger.info("Processing payment for order: {}", request.getOrderId());

        Payment payment = Payment.builder()
                .id(UUID.randomUUID().toString())
                .orderId(request.getOrderId())
                .amount(request.getAmount())
                .status("PAID")
                .reference("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        if (orderServiceClient != null) {
            try {
                orderServiceClient.updateOrderStatus(savedPayment.getOrderId(), "PAID");
            } catch (Exception ex) {
                logger.warn("Unable to update order status for order {}: {}", savedPayment.getOrderId(),
                        ex.getMessage());
            }
        }

        return toResponse(savedPayment);
    }

    @Override
    public PaymentResponse getPaymentByOrderId(String orderId) {
        logger.info("Fetching payment for order: {}", orderId);
        if (orderId == null || orderId.isBlank()) {
            throw new IllegalArgumentException("orderId is required");
        }

        Optional<Payment> payment = paymentRepository.findByOrderId(orderId);
        return payment.map(this::toResponse).orElse(null);
    }

    @Override
    public PaymentResponse getPaymentById(String paymentId) {
        logger.info("Fetching payment with ID: {}", paymentId);
        if (paymentId == null || paymentId.isBlank()) {
            throw new IllegalArgumentException("paymentId is required");
        }

        Optional<Payment> payment = paymentRepository.findById(paymentId);
        return payment.map(this::toResponse).orElse(null);
    }

    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .reference(payment.getReference())
                .build();
    }
}
