package com.example.catalogservice.controller;

import com.example.catalogservice.dto.MenuItemRequest;
import com.example.catalogservice.dto.MenuItemResponse;
import com.example.catalogservice.service.CatalogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/items")
@Tag(name = "Catalog", description = "Menu catalog endpoints")
public class CatalogController {

    @Autowired
    private CatalogService catalogService;

    @GetMapping
    @Operation(summary = "Get all menu items", description = "Retrieve all available menu items")
    @ApiResponse(responseCode = "200", description = "List of items returned")
    public ResponseEntity<List<MenuItemResponse>> getAllItems() {
        return ResponseEntity.ok(catalogService.getAllItems());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get menu item by ID", description = "Retrieve a specific menu item by ID")
    @ApiResponse(responseCode = "200", description = "Item found")
    @ApiResponse(responseCode = "404", description = "Item not found")
    public ResponseEntity<MenuItemResponse> getItemById(@PathVariable String id) {
        return ResponseEntity.ok(catalogService.getItemById(id));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get items by category", description = "Retrieve menu items by category")
    @ApiResponse(responseCode = "200", description = "List of items returned")
    public ResponseEntity<List<MenuItemResponse>> getItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(catalogService.getItemsByCategory(category));
    }

    @PostMapping
    @Operation(summary = "Create a new menu item", description = "Add a new item to the catalog (ADMIN)")
    @ApiResponse(responseCode = "201", description = "Item created")
    public ResponseEntity<MenuItemResponse> createItem(@RequestBody MenuItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogService.createItem(request));
    }

    @PatchMapping("/{id}/availability")
    @Operation(summary = "Update item availability", description = "Update availability status of a menu item (ADMIN)")
    @ApiResponse(responseCode = "200", description = "Availability updated")
    @ApiResponse(responseCode = "404", description = "Item not found")
    public ResponseEntity<MenuItemResponse> updateAvailability(
            @PathVariable String id,
            @RequestParam String availability) {
        return ResponseEntity.ok(catalogService.updateItemAvailability(id, availability));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a menu item", description = "Remove an item from the catalog (ADMIN)")
    @ApiResponse(responseCode = "204", description = "Item deleted")
    @ApiResponse(responseCode = "404", description = "Item not found")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        catalogService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
