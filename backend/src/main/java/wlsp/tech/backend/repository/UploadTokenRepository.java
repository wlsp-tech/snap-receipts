package wlsp.tech.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import wlsp.tech.backend.model.token.UploadToken;

public interface UploadTokenRepository extends MongoRepository<UploadToken, String> {
}
