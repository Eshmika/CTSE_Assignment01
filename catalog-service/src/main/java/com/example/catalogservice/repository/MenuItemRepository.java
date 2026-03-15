package com.example.catalogservice.repository;

import com.example.catalogservice.entity.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends MongoRepository<MenuItem, String> {
    List<MenuItem> findByCategory(String category);
    List<MenuItem> findByAvailability(String availability);
}
