package wlsp.tech.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import wlsp.tech.backend.model.user.User;

import java.util.Optional;

@Repository
public interface UserRepository  extends MongoRepository<User, String> {
  Optional<User> findByEmail(String email);
}
