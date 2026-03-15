package com.example.catalogservice.service;

import com.example.catalogservice.dto.MenuItemRequest;
import com.example.catalogservice.dto.MenuItemResponse;
import java.util.List;

public interface CatalogService {
    List<MenuItemResponse> getAllItems();

    MenuItemResponse getItemById(String itemId);

    List<MenuItemResponse> getItemsByCategory(String category);

    MenuItemResponse updateItemAvailability(String itemId, String availability);

    MenuItemResponse createItem(MenuItemRequest request);

    void deleteItem(String itemId);
}
