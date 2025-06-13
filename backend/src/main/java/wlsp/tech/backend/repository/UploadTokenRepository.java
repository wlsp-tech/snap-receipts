package wlsp.tech.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import wlsp.tech.backend.model.token.UploadToken;

import java.util.Optional;

public interface UploadTokenRepository extends MongoRepository<UploadToken, String> {
  Optional<UploadToken> findById(String id);
}
