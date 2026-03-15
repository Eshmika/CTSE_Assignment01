package com.example.catalogservice.service;

import com.example.catalogservice.dto.MenuItemRequest;
import com.example.catalogservice.dto.MenuItemResponse;
import com.example.catalogservice.entity.MenuItem;
import com.example.catalogservice.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CatalogServiceImpl implements CatalogService {
    private static final Logger logger = LoggerFactory.getLogger(CatalogServiceImpl.class);

    @Autowired
    private MenuItemRepository menuItemRepository;

    // --- mapping helper ---
    private MenuItemResponse toResponse(MenuItem item) {
        return new MenuItemResponse(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getPrice(),
                item.getAvailability(),
                item.getCategory(),
                item.getImageUrl());
    }

    @Override
    public List<MenuItemResponse> getAllItems() {
        logger.info("Fetching all menu items");
        return menuItemRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MenuItemResponse getItemById(String itemId) {
        logger.info("Fetching menu item with ID: {}", itemId);
        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found: " + itemId));
        return toResponse(item);
    }

    @Override
    public List<MenuItemResponse> getItemsByCategory(String category) {
        logger.info("Fetching menu items with category: {}", category);
        return menuItemRepository.findByCategory(category)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MenuItemResponse updateItemAvailability(String itemId, String availability) {
        logger.info("Updating availability for item: {} to {}", itemId, availability);
        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found: " + itemId));
        item.setAvailability(availability);
        item.setUpdatedAt(LocalDateTime.now());
        return toResponse(menuItemRepository.save(item));
    }

    @Override
    public MenuItemResponse createItem(MenuItemRequest request) {
        logger.info("Creating new menu item: {}", request.getName());
        MenuItem item = MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .build();
        return toResponse(menuItemRepository.save(item));
    }

    @Override
    public void deleteItem(String itemId) {
        logger.info("Deleting menu item with ID: {}", itemId);
        if (!menuItemRepository.existsById(itemId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found: " + itemId);
        }
        menuItemRepository.deleteById(itemId);
    }
}
