package com.example.authservice.repository;

import com.example.authservice.entity.Address;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends MongoRepository<Address, String> {
    @Query("{ 'user.id': ?0 }")
    List<Address> findByUserId(String userId);

    @Query("{ '_id': ?0, 'user.id': ?1 }")
    Optional<Address> findByIdAndUserId(String id, String userId);
}
