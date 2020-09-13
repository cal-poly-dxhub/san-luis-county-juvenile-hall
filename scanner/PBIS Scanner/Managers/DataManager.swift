// MARK: Imports

import Foundation
import Amplify
import AmplifyPlugins
import Combine

// MARK: Classes

class JuvenileManager: ObservableObject, APIManagerInjector {
    
    // MARK: Initializers
    
    let behaviorsEndpointConfig = EndpointConfiguration(path: .behavior,
                                                        httpMethod: .get,
                                                        body: nil,
                                                        queryStrings: nil)
    
    let locationsEndpointConfig = EndpointConfiguration(path: .location,
                                                        httpMethod: .get,
                                                        body: nil,
                                                        queryStrings: nil)
    
    let juvenilesEndpointConfig = EndpointConfiguration(path: .juvenile(.get),
                                                        httpMethod: .get,
                                                        body: nil,
                                                        queryStrings: nil)

    init() {
    }
    
    private func remoteFetchForAllJuveniles(completion: @escaping ([Juvenile]) -> Void) {
        apiManager.fetch(from: juvenilesEndpointConfig, completion: <#T##(Result<Decodable, ResponseError>) -> Void#>)
    }
}

// MARK: Helper Methods

extension JuvenileManager {
    func clearAllData() {
        Amplify.DataStore.clear { result in
            switch result {
            case .success:
                print("Successfully cleared DataStore.")
            case .failure(let error):
                print(error)
            }
        }
    }
}

// MARK: Local

extension JuvenileManager {
    func observeJuveniles() {
        Amplify.DataStore.publisher(for: Juvenile.self)
            .sink(receiveCompletion: { completion in
                switch completion {
                case .failure(let error):
                    print(error)
                default:
                    break
                }
            }) { event in
                switch DataStoreMutationType(rawValue: event.mutationType) {
                case .create:
                    print("dsfdsf")
                case .delete:
                    print("dsfdsf")
                default:
                    print("Mutation type does not exist?")
                }
        }
    }
    
    func localFetchForAllJuveniles(completion: ([Juvenile]) -> Void) {
        Amplify.DataStore.query(Juvenile.self) { result in
            switch result {
            case .success(let juveniles):
                completion(juveniles)
            case .failure(let error):
                print(error)
            }
        }
    }
    
    func localFetchForJuvenileWithEventID(_ id: Int, completion: (Juvenile?) -> Void) {
        let p = Juvenile.keys
        Amplify.DataStore.query(Juvenile.self, where: p.event_id == id, completion: { result in
            switch result {
            case .success(let juveniles):
                if let juvenile = juveniles.first {
                    completion(juvenile)
                }
            case .failure(let error):
                print(error)
            }
        })
    }
}
