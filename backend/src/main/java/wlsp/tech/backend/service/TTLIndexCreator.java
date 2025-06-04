package wlsp.tech.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.stereotype.Component;
import wlsp.tech.backend.model.token.UploadToken;

@Component
@RequiredArgsConstructor
public class TTLIndexCreator implements ApplicationRunner {

  private final MongoTemplate mongoTemplate;

  @Override
  public void run(ApplicationArguments args) {
    Index index = new Index()
            .on("createdAt", Sort.Direction.ASC)
            .expire(3600);

    mongoTemplate.indexOps(UploadToken.class).createIndex(index);
  }
}
